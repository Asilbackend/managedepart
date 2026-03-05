import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateSocialAssistanceDto } from './dto/create-social-assistance.dto';
import { UpdateSocialAssistanceDto } from './dto/update-social-assistance.dto';
import {
  SocialAssistance,
  SocialAssistanceStatus,
} from './entities/social-assistances.entity';

@Injectable()
export class SocialAssistanceService {
  constructor(
    @InjectRepository(SocialAssistance)
    private readonly repo: Repository<SocialAssistance>,

    private readonly dataSource: DataSource, // transactional uchun
  ) {}

  async create(dto: CreateSocialAssistanceDto): Promise<SocialAssistance> {
    return this.dataSource.transaction(async (manager) => {
      const assistance = manager.create(SocialAssistance, {
        ...dto,
        status: dto.status ?? SocialAssistanceStatus.PENDING,
        created_at: new Date(),
      });

      return manager.save(assistance);
    });
  }

  async findAll(): Promise<SocialAssistance[]> {
    return this.repo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SocialAssistance> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Social assistance #${id} not found`);
    }
    return entity;
  }

  async findByPinfl(pinfl: string): Promise<SocialAssistance[]> {
    return this.repo.find({
      where: { citizen_pinfl: pinfl },
      order: { created_at: 'DESC' },
    });
  }

  async update(
    id: number,
    dto: UpdateSocialAssistanceDto,
  ): Promise<SocialAssistance> {
    const entity = await this.findOne(id); // throws if not found

    return this.dataSource.transaction(async (manager) => {
      Object.assign(entity, dto);
      if (
        dto.status === SocialAssistanceStatus.APPROVED &&
        !entity.expires_at
      ) {
        // masalan: 6 oy muddat
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 6);
        entity.expires_at = expires;
      }

      return manager.save(entity);
    });
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity); // yoki hard delete: remove(entity)
    // Agar transaction kerak bo'lsa — shu yerda ham qo'shish mumkin
  }

  // Qo'shimcha: statusni o'zgartirish (masalan, approve / reject)
  async changeStatus(id: number, newStatus: string): Promise<SocialAssistance> {
    const validStatuses = Object.values(SocialAssistanceStatus);
    if (!validStatuses.includes(newStatus as SocialAssistanceStatus)) {
      throw new BadRequestException(
        `Noto‘g‘ri status: "${newStatus}". Ruxsat etilgan: ${validStatuses.join(', ')}`,
      );
    }
    const entity = await this.findOne(id);
    entity.status = newStatus as SocialAssistanceStatus;

    if (
      (newStatus as SocialAssistanceStatus) === SocialAssistanceStatus.APPROVED
    ) {
      // muddat qo'yish logikasi
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 12); // 1 yil misol
      entity.expires_at = expires;
    }

    return this.repo.save(entity);
  }
}
