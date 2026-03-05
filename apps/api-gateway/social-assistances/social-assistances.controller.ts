// src/social-assistances/social-assistances.controller.ts
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SocialAssistancesService } from './social-assistances.service';
import { CreateSocialAssistanceDto } from './dto/create-social-assistance.dto';
import { UpdateSocialAssistanceDto } from './dto/update-social-assistance.dto';
import { RequirePermission } from '../src/decorators/require-permission.decorator';
import { RequireRole } from '../src/decorators/role.decorator';

@ApiTags('social-assistances (Gateway)')
@Controller('social-assistances')
export class SocialAssistancesController {
  constructor(private readonly service: SocialAssistancesService) {}
  @RequirePermission('social:create')
  @Post()
  @ApiOperation({
    summary: 'Yangi ijtimoiy yordam yaratish (microservice ga proxy)',
  })
  async create(@Body() dto: CreateSocialAssistanceDto) {
    return this.service.create(dto);
  }
  @RequirePermission('social:read')
  @Get()
  @ApiOperation({ summary: 'Barcha ijtimoiy yordamlar ro‘yxati' })
  async findAll(@Query() query?: any) {
    // pagination/filter qo'shsa bo'ladi
    return this.service.findAll(query);
  }
  @RequirePermission('social:read')
  @Get(':id')
  @ApiOperation({ summary: 'Bitta ijtimoiy yordam ma‘lumotlari' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
  @RequirePermission('social:read')
  @Get('by-pinfl/:pinfl')
  @ApiOperation({ summary: 'Fuqaro PINFL bo‘yicha barcha yordamlar' })
  async findByPinfl(@Param('pinfl') pinfl: string) {
    return this.service.findByPinfl(pinfl);
  }
  @RequirePermission('social:update')
  @Put(':id')
  @ApiOperation({ summary: 'Ijtimoiy yordamni yangilash' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSocialAssistanceDto,
  ) {
    return this.service.update(id, dto);
  }
  @RequireRole('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Ijtimoiy yordamni o‘chirish' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    // NO_CONTENT uchun hech narsa qaytarmaydi
  }

  // Qo'shimcha: status o'zgartirish (masalan, approve/reject)
  @RequirePermission('social:update')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Statusni o‘zgartirish' })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: string, // yoki enum ishlatilsa
  ) {
    return this.service.changeStatus(id, status);
  }
}
