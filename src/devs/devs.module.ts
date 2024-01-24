import { Module } from '@nestjs/common';
import { DevsService } from './devs.service';
import { DevsController } from './devs.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DEVS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'devs_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [DevsController],
  providers: [DevsService],
})
export class DevsModule {}
