import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private isConnected = false;
  constructor(@Inject('USERS_SERVICE') private client: ClientProxy) {
    this.connectToClient();
  }

  private async connectToClient() {
    try {
      await this.client.connect();
      this.isConnected = true;
      this.logger.log('Connected to the client successfully');
    } catch (error) {
      this.logger.error(
        `Error connecting to client: ${error.message}`,
        error.stack,
      );
    }
  }

  async create(createUserDto: CreateUserDto): Promise<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('createUser', createUserDto);
  }

  async findAll(): Promise<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('findAllUsers', {});
  }

  findOne(id: number): Observable<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('findOneUser', id);
  }

  update(id: number, updateUserDto: UpdateUserDto): Observable<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('updateUser', { id, updateUserDto });
  }

  remove(id: number): Observable<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('removeUser', id);
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
      await this.client.close();
      this.isConnected = false;
      this.logger.log('Client connection closed gracefully');
    }
  }
}
