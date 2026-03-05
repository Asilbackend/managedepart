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
} from '@nestjs/common';
import { CreateSocialAssistanceDto } from './dto/create-social-assistance.dto';
import { UpdateSocialAssistanceDto } from './dto/update-social-assistance.dto';
import { SocialAssistanceService } from './social-assistances.service';

@Controller('social-assistances')
export class SocialAssistanceController {
  constructor(private readonly service: SocialAssistanceService) {}

  @Post()
  async create(@Body() dto: CreateSocialAssistanceDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findOne(id);
  }

  @Get('by-pinfl/:pinfl')
  async findByPinfl(@Param('pinfl') pinfl: string) {
    return this.service.findByPinfl(pinfl);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSocialAssistanceDto,
  ) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.service.changeStatus(id, status);
  }
}
