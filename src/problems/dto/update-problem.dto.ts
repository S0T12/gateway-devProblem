import { PickType } from '@nestjs/mapped-types';
import { CreateProblemDto } from './create-problem.dto';

export class UpdateProblemDto extends PickType(CreateProblemDto, [
  'description',
  'title' as const,
]) {}
