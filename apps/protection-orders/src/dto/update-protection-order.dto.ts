import { CreateProtectionOrderDto } from './create-protection-order.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateProtectionOrderDto extends PartialType(
  CreateProtectionOrderDto,
) {}
