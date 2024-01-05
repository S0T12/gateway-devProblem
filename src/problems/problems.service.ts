import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { of } from 'rxjs';

@Injectable()
export class ProblemsService {
  private readonly logger = new Logger(ProblemsService.name);
  private isConnected = false;

  constructor(
    @Inject('PROBLEMS_SERVICE') private readonly client: ClientProxy,
  ) {
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

  create(createProblemDto: CreateProblemDto) {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('createProblem', createProblemDto);
  }

  findAll() {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('findAllProblems', {});
  }

  findOne(id: ObjectId) {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('findOneProblem', id);
  }

  update(id: number, updateProblemDto: UpdateProblemDto) {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('updateProblem', {
      id,
      updateProblemDto,
    });
  }

  remove(id: number) {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.client.send('removeProblem', id);
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
