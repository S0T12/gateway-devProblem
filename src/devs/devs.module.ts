import { Module } from '@nestjs/common';
import { DevsService } from './devs.service';
import { DevsController } from './devs.controller';

@Module({
  controllers: [DevsController],
  providers: [DevsService],
})
export class DevsModule {}
