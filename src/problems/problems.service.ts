import { Inject, Injectable } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProblemsService {
  constructor(
    @Inject('PROBLEMS_SERVICE') private readonly client: ClientProxy,
  ) {
    this.client.connect();
  }
  create(createProblemDto: CreateProblemDto) {
    return this.client.send('createProblem', createProblemDto);
  }

  findAll() {
    const problems = this.client.send('findAllProblems', {});
    return problems;
  }

  findOne(id: ObjectId) {
    const problem = this.client.send('findOneProblem', id);
    return problem;
  }

  update(id: number, updateProblemDto: UpdateProblemDto) {
    const problem = this.client.send('updateProblem', {
      id,
      updateProblemDto,
    });
    return problem;
  }

  remove(id: number) {
    const problem = this.client.send('removeProblem', id);
    return problem;
  }
}
