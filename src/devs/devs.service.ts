import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateDevDto } from './dto/create-dev.dto';
import { UpdateDevDto } from './dto/update-dev.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import { ObjectId } from 'mongodb';

@Injectable()
export class DevsService {
  private readonly logger = new Logger(DevsService.name);
  private isConnected = false;
  constructor(@Inject('DEVS_SERVICE') private readonly devClient: ClientProxy) {
    this.connectToClient();
  }

  private async connectToClient() {
    try {
      await this.devClient.connect();
      this.isConnected = true;
      this.logger.log('Connected to the client successfully');
    } catch (error) {
      this.logger.error(
        `Error connecting to client: ${error.message}`,
        error.stack,
      );
    }
  }
  create(createDevDto: CreateDevDto): Observable<CreateDevDto> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.devClient.send('createDev', createDevDto);
  }

  findAll(): Observable<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.devClient.send('findAllDevs', {});
  }

  findOne(id: number): Observable<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.devClient.send('findOneDev', id);
  }

  update(id: number, updateDevDto: UpdateDevDto): Observable<UpdateDevDto> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    const objectId: ObjectId = new ObjectId(id);
    return this.devClient.send('updateDev', { objectId, updateDevDto });
  }

  remove(id: number): Observable<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.devClient.send('removeDev', id);
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(
      `Application is shutting down (Signal: ${signal || 'undefined'})`,
    );

    await this.close();

    this.logger.log('Application shutdown completed');
  }

  async close() {
    if (this.isConnected) {
      await this.devClient.close();
      this.isConnected = false;
      this.logger.log('Client connection closed gracefully');
    }
  }
}
