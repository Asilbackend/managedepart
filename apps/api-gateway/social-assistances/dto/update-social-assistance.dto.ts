import { CreateSocialAssistanceDto } from './create-social-assistance.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSocialAssistanceDto extends PartialType(
  CreateSocialAssistanceDto,
) {
  // id ni path dan olamiz, shuning uchun bu yerda yo'q
}
