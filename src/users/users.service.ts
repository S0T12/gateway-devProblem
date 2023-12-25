import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private client: ClientProxy) {
    this.client.connect();
  }

  async create(createUserDto: CreateUserDto) {
    const result = this.client.send('createUser', createUserDto);
    return result;
  }

  async findAll() {
    const users = this.client.send('findAllUsers', {});
    return users;
  }

  findOne(id: number) {
    const user = this.client.send('findOneUser', id);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.client.send('updateUser', { id, updateUserDto });
    return user;
  }

  remove(id: number) {
    const user = this.client.send('removeUser', id);
    return user;
  }
}
