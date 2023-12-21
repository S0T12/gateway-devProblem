import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProblemsModule } from './problems/problems.module';
import { IdeasModule } from './ideas/ideas.module';
import { DevsModule } from './devs/devs.module';

@Module({
  imports: [UsersModule, ProblemsModule, IdeasModule, DevsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
