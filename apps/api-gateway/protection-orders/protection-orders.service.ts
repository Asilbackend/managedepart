import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateProtectionOrderDto } from './dto/create-protection-order.dto';
import { UpdateProtectionOrderDto } from './dto/update-protection-order.dto';
import { HttpProxyService } from '../src/common/http-proxy.service';

@Injectable()
export class ProtectionOrdersService {
  constructor(
    private readonly proxy: HttpProxyService,
    private readonly config: ConfigService,
  ) {}

  private getBaseUrl(): string {
    const url = this.config.get<string>('services.orders.url');
    if (!url) {
      throw new Error('PROTECTION_ORDERS_URL config topilmadi');
    }
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  async create(dto: CreateProtectionOrderDto) {
    const url = `${this.getBaseUrl()}/protection-orders`;
    return await this.proxy.post(url, dto);
  }

  async findAll() {
    const url = `${this.getBaseUrl()}/protection-orders`;
    return await this.proxy.get(url);
  }

  async findOne(id: number) {
    const url = `${this.getBaseUrl()}/protection-orders/${id}`;
    return await this.proxy.get(url);
  }

  async findByPinfl(pinfl: string) {
    const url = `${this.getBaseUrl()}/protection-orders/by-pinfl/${pinfl}`;
    return await this.proxy.get(url);
  }

  async findByOrderNumber(orderNumber: string) {
    const url = `${this.getBaseUrl()}/protection-orders/by-number/${orderNumber}`;
    return await this.proxy.get(url);
  }

  async update(id: number, dto: UpdateProtectionOrderDto) {
    const url = `${this.getBaseUrl()}/protection-orders/${id}`;
    return await this.proxy.patch(url, dto);
  }

  async remove(id: number) {
    const url = `${this.getBaseUrl()}/protection-orders/${id}`;
    return await this.proxy.delete(url);
  }

  async changeStatus(id: number, status: string) {
    const url = `${this.getBaseUrl()}/protection-orders/${id}/status`;
    return await this.proxy.patch(url, { status });
  }
}
