import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProtectionOrdersService } from './protection-orders.service';
import { CreateProtectionOrderDto } from './dto/create-protection-order.dto';
import { UpdateProtectionOrderDto } from './dto/update-protection-order.dto';

@Controller('protection-orders')
export class ProtectionOrdersController {
  constructor(private readonly service: ProtectionOrdersService) {}

  @Post()
  async create(@Body() dto: CreateProtectionOrderDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get('by-pinfl/:pinfl')
  async findByPinfl(@Param('pinfl') pinfl: string) {
    return this.service.findByPinfl(pinfl);
  }

  @Get('by-number/:orderNumber')
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    const order = await this.service.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }
    return order;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProtectionOrderDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }

  // Qo'shimcha endpoint — status o'zgartirish
  @Patch(':id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.service.changeStatus(id, status);
  }
}
