import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user-service/user.service';
import { ConfigService } from '@nestjs/config';
import { HttpProxyService } from '../src/common/http-proxy.service';

interface ProtectionOrderDto {
  id: number;
  status: string;
  order_number?: string;
  citizen_pinfl?: string;
  description?: string;
  expires_at?: Date;
}

interface SocialAssistanceDto {
  id: number;
  status: string;
  amount: number;
  reason?: string;
  expires_at?: Date;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: any;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly proxy: HttpProxyService,
  ) {}
  async searchUser(pinfl: string): Promise<SearchResponse> {
    this.logger.log(`Search boshlandi. PINFL: ${pinfl}`);

    const user = await this.userService.findByPinfl(pinfl);

    if (!user) {
      this.logger.warn(`User topilmadi. PINFL: ${pinfl}`);
      return {
        success: false,
        message: 'User topilmadi',
        data: null,
      };
    }

    const [socialResult, protectionResult] = await Promise.allSettled([
      this.findSocialByPinfl(pinfl),
      this.findProtectionByPinfl(pinfl),
    ]);

    let socialAssistances: SocialAssistanceDto[] = [];
    let protectionOrders: ProtectionOrderDto[] = [];

    if (socialResult.status === 'fulfilled') {
      this.logger.log(
        `Social service javobi: ${JSON.stringify(socialResult.value)}`,
      );
      socialAssistances = socialResult.value;
    } else {
      this.logger.error(`Social service xato: ${socialResult.reason}`);
    }

    if (protectionResult.status === 'fulfilled') {
      this.logger.log(
        `Protection service javobi: ${JSON.stringify(protectionResult.value)}`,
      );
      protectionOrders = protectionResult.value;
    } else {
      this.logger.error(`Protection service xato: ${protectionResult.reason}`);
    }

    return {
      success: true,
      message: 'Ma’lumotlar muvaffaqiyatli olindi',
      data: {
        user: {
          id: user.id,
          full_name: `${user.firstName} ${user.lastName}`,
          pinfl: user.pinfl,
          phone: user.phone,
        },

        protection: {
          total: protectionOrders.length,
          active: protectionOrders.filter((o) => o.status === 'active').length,
          expired: protectionOrders.filter((o) => o.status === 'expired')
            .length,
          list: protectionOrders,
        },

        social_assistance: {
          total: socialAssistances.length,
          active: socialAssistances.filter((s) => s.status === 'active').length,
          approved: socialAssistances.filter((s) => s.status === 'approved')
            .length,
          total_amount: socialAssistances.reduce(
            (sum, s) => sum + Number(s.amount || 0),
            0,
          ),
          list: socialAssistances,
        },
      },
    };
  }

  async findSocialByPinfl(pinfl: string): Promise<SocialAssistanceDto[]> {
    const url = `${this.getSocialBaseUrl()}/social-assistances/by-pinfl/${pinfl}`;

    this.logger.log(`Social service so‘rov: ${url}`);

    const data = await this.proxy.get(url);

    return data as SocialAssistanceDto[];
  }

  async findProtectionByPinfl(pinfl: string): Promise<ProtectionOrderDto[]> {
    const url = `${this.getProtectionOrderBaseUrl()}/protection-orders/by-pinfl/${pinfl}`;

    this.logger.log(`Protection service so‘rov: ${url}`);

    const data = await this.proxy.get(url);

    return data as ProtectionOrderDto[];
  }

  /* ============================= */
  /* ====== CONFIG HELPERS ======= */
  /* ============================= */

  private getSocialBaseUrl(): string {
    const url = this.config.get<string>('services.social.url');
    if (!url) throw new Error('SOCIAL_SERVICE_URL config yo‘q');
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  private getProtectionOrderBaseUrl(): string {
    const url = this.config.get<string>('services.orders.url');
    if (!url) throw new Error('PROTECTION_ORDER_URL config yo‘q');
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
}
