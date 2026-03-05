import { registerAs } from '@nestjs/config';

export default registerAs('services', () => ({
  auth: {
    url: process.env.AUTH_SERVICE_URL || '',
  },
  orders: {
    url: process.env.PROTECTION_ORDERS_SERVICE_URL || 'http://localhost:3002',
  },
  social: {
    url: process.env.SOCIAL_ASSISTANCES_URL || 'http://localhost:3003',
  },
}));
