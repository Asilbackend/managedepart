import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProtectionOrderDto } from './dto/create-protection-order.dto';
import { UpdateProtectionOrderDto } from './dto/update-protection-order.dto';
import {
  ProtectionOrder,
  ProtectionOrderStatus,
} from './entities/protection-orders.entity';

@Injectable()
export class ProtectionOrdersService {
  constructor(
    @InjectRepository(ProtectionOrder)
    private readonly repository: Repository<ProtectionOrder>,

    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateProtectionOrderDto): Promise<ProtectionOrder> {
    return this.dataSource.transaction(async (manager) => {
      const entity = manager.create(ProtectionOrder, {
        ...dto,
        status: dto.status ?? ProtectionOrderStatus.ACTIVE,
        created_at: new Date(),
      });

      return manager.save(entity);
    });
  }

  async findAll(): Promise<ProtectionOrder[]> {
    return this.repository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ProtectionOrder> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Protection order #${id} not found`);
    }
    return entity;
  }

  async findByPinfl(pinfl: string): Promise<ProtectionOrder[]> {
    return this.repository.find({
      where: { citizen_pinfl: pinfl },
      order: { created_at: 'DESC' },
    });
  }

  async findByOrderNumber(
    orderNumber: string,
  ): Promise<ProtectionOrder | null> {
    return this.repository.findOneBy({ order_number: orderNumber });
  }

  async update(
    id: number,
    dto: UpdateProtectionOrderDto,
  ): Promise<ProtectionOrder> {
    const entity = await this.findOne(id);

    return this.dataSource.transaction(async (manager) => {
      Object.assign(entity, dto);

      // Agar status EXTENDED bo'lsa va expires_at yangilansa
      if (dto.status === ProtectionOrderStatus.EXTENDED && dto.expires_at) {
        entity.expires_at = dto.expires_at;
      }

      return manager.save(entity);
    });
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.softRemove(entity); // soft-delete (agar deletedAt qo'shilgan bo'lsa)
    // yoki hard delete: await this.repository.remove(entity);
  }

  // Qo'shimcha: statusni alohida o'zgartirish (ko'p ishlatiladi)
  async changeStatus(id: number, newStatus: string): Promise<ProtectionOrder> {
    const validStatuses = Object.values(ProtectionOrderStatus);
    if (!validStatuses.includes(newStatus as ProtectionOrderStatus)) {
      throw new BadRequestException(
        `Noto‘g‘ri status: "${newStatus}". Ruxsat etilgan: ${validStatuses.join(', ')}`,
      );
    }

    const entity = await this.findOne(id);

    entity.status = newStatus as ProtectionOrderStatus;

    // Ba'zi statuslar uchun avto-logika (masalan)
    if (
      (newStatus as ProtectionOrderStatus) === ProtectionOrderStatus.EXPIRED
    ) {
      entity.expires_at = new Date(); // yoki saqlash vaqti
    }

    return this.repository.save(entity);
  }
}
