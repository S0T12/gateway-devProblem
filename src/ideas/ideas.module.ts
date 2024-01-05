import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IDEAS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [IdeasController],
  providers: [IdeasService],
})
export class IdeasModule {}
