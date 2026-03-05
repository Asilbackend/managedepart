// src/social-assistances/social-assistances.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateSocialAssistanceDto } from './dto/create-social-assistance.dto';
import { UpdateSocialAssistanceDto } from './dto/update-social-assistance.dto';
import { HttpProxyService } from '../src/common/http-proxy.service';

@Injectable()
export class SocialAssistancesService {
  constructor(
    private readonly proxy: HttpProxyService,
    private readonly config: ConfigService,
  ) {}

  private getBaseUrl(): string {
    const url = this.config.get<string>('services.social.url');
    if (!url) throw new Error('SOCIAL_ASSISTANCE_URL config yo‘q');
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  async create(dto: CreateSocialAssistanceDto) {
    const url = `${this.getBaseUrl()}/social-assistances`;
    return await this.proxy.post(url, dto);
  }

  async findAll(query: any = {}) {
    const params = new URLSearchParams(query).toString();
    const url = `${this.getBaseUrl()}/social-assistances${params ? '?' + params : ''}`;
    return await this.proxy.get(url); // HttpProxyService ga get metodini qo'shish kerak bo'ladi
  }

  async findOne(id: number) {
    const url = `${this.getBaseUrl()}/social-assistances/${id}`;
    return this.proxy.get(url);
  }

  async findByPinfl(pinfl: string) {
    const url = `${this.getBaseUrl()}/social-assistances/by-pinfl/${pinfl}`;
    return this.proxy.get(url);
  }

  async update(id: number, dto: UpdateSocialAssistanceDto) {
    const url = `${this.getBaseUrl()}/social-assistances/${id}`;
    return this.proxy.patch(url, dto);
  }

  async remove(id: number) {
    const url = `${this.getBaseUrl()}/social-assistances/${id}`;
    return this.proxy.delete(url);
  }

  async changeStatus(id: number, status: string) {
    const url = `${this.getBaseUrl()}/social-assistances/${id}/status`;
    return this.proxy.patch(url, { status });
  }
}
