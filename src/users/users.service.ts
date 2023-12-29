import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private client: ClientProxy) {
    this.client.connect();
  }

  async create(createUserDto: CreateUserDto): Promise<object> {
    const result = this.client.send('createUser', createUserDto);
    return result;
  }

  async findAll(): Promise<object> {
    const users = this.client.send('findAllUsers', {});
    return users;
  }

  findOne(id: number): Observable<object> {
    const user = this.client.send('findOneUser', id);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): Observable<object> {
    const user = this.client.send('updateUser', { id, updateUserDto });
    return user;
  }

  remove(id: number): Observable<object> {
    const user = this.client.send('removeUser', id);
    return user;
  }
}
