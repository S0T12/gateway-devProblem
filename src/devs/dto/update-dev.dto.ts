import { PickType } from '@nestjs/mapped-types';
import { CreateDevDto } from './create-dev.dto';

export class UpdateDevDto extends PickType(CreateDevDto, [
  'title',
  'description' as const,
]) {}
