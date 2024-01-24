import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { Observable, of } from 'rxjs';

@Injectable()
export class IdeasService implements OnApplicationShutdown {
  private readonly logger = new Logger(IdeasService.name);
  private isConnected = false;
  constructor(
    @Inject('IDEAS_SERVICE') private readonly ideaClient: ClientProxy,
  ) {
    this.connectToClient();
  }

  private async connectToClient() {
    try {
      await this.ideaClient.connect();
      this.isConnected = true;
      this.logger.log('Connected to the client successfully');
    } catch (error) {
      this.logger.error(
        `Error connecting to client: ${error.message}`,
        error.stack,
      );
    }
  }

  create(createIdeaDto: CreateIdeaDto): Observable<CreateIdeaDto> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.ideaClient.send('createIdea', createIdeaDto);
  }

  findAll(): Observable<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.ideaClient.send('findAllIdeas', {});
  }

  findOne(id: ObjectId): Observable<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.ideaClient.send('findOneIdea', id);
  }

  update(
    id: ObjectId,
    updateIdeaDto: UpdateIdeaDto,
  ): Observable<UpdateIdeaDto> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    const objectId: ObjectId = new ObjectId(id);
    return this.ideaClient.send('updateIdea', { objectId, updateIdeaDto });
  }

  remove(id: ObjectId): Observable<object> {
    if (!this.isConnected) {
      this.logger.warn('Client is not connected!');
      return of();
    }
    return this.ideaClient.send('removeIdea', id);
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
      await this.ideaClient.close();
      this.isConnected = false;
      this.logger.log('Client connection closed gracefully');
    }
  }
}
