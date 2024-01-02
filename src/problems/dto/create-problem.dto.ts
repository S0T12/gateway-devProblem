import { IsString } from 'class-validator';

export class CreateProblemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  creator: string;
}
