import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpProxyService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Umumiy HTTP so'rov yuboruvchi metod (POST uchun optimallashtirilgan)
   * @param url to'liq yoki relative URL (masalan '/login' yoki 'http://auth:3001/login')
   * @param data POST body (agar kerak bo'lsa)
   * @param config qo'shimcha sozlamalar (headers, timeout va h.k.)
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(url, data, {
          timeout: 8000, // default timeout (sekundda)
          ...config,
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.response?.data?.message ||
        error.message ||
        'Xizmat bilan bog‘lanib bo‘lmadi';

      throw new HttpException(
        {
          statusCode: status,
          message,
          error: error.response?.data?.error || 'Service Error',
          // xohlasangiz original xatolikni ham qo'shish mumkin (faqat dev muhitda)
        },
        status,
      );
    }

    // Agar axios bo'lmasa (masalan tarmoq xatosi)
    throw new HttpException(
      {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Xizmat mavjud emas yoki ulanishda muammo',
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
  // src/common/services/http-proxy.service.ts (qo'shimcha metodlar)

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(url, { timeout: 8000, ...config }),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch<T>(url, data, { timeout: 8000, ...config }),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete<T>(url, { timeout: 8000, ...config }),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
