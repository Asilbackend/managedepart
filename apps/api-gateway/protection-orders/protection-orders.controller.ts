import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProtectionOrdersService } from './protection-orders.service';
import { CreateProtectionOrderDto } from './dto/create-protection-order.dto';
import { UpdateProtectionOrderDto } from './dto/update-protection-order.dto';
import { RequirePermission } from '../src/decorators/require-permission.decorator';
import { RequireRole } from '../src/decorators/role.decorator';

@ApiTags('protection-orders (Gateway)')
@Controller('protection-orders')
export class ProtectionOrdersController {
  constructor(private readonly service: ProtectionOrdersService) {}
  @RequirePermission('order:create')
  @Post()
  async create(@Body() dto: CreateProtectionOrderDto) {
    return await this.service.create(dto);
  }
  @RequirePermission('order:read')
  @Get()
  async findAll() {
    return await this.service.findAll();
  }
  @RequirePermission('order:read')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findOne(id);
  }
  @RequirePermission('order:read')
  @Get('by-pinfl/:pinfl')
  async findByPinfl(@Param('pinfl') pinfl: string) {
    return await this.service.findByPinfl(pinfl);
  }
  @RequirePermission('order:read')
  @Get('by-number/:orderNumber')
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return await this.service.findByOrderNumber(orderNumber);
  }

  @Put(':id')
  @RequirePermission('order:update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProtectionOrderDto,
  ) {
    return await this.service.update(id, dto);
  }
  @RequireRole('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
  @RequirePermission('order:update')
  @Patch(':id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: string,
  ) {
    return await this.service.changeStatus(id, status);
  }
}
