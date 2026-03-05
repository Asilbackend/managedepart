import { CreateSocialAssistanceDto } from './create-social-assistance.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSocialAssistanceDto extends PartialType(
  CreateSocialAssistanceDto,
) {}
