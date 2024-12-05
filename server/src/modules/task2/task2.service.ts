import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './entities/task.entity';
import {Repository} from 'typeorm';

@Injectable()
export class Task2Service {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async create(task: Task): Promise<Task> {
    try {
      //TODO implentar criação do relacionamento com experiment
      return await this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async findOne(id: string): Promise<Task> {
    return await this.taskRepository.findOneBy({_id: id});
  }

  async update(id: string, task: Task): Promise<Task> {
    await this.taskRepository.update({_id: id}, task);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    return await this.taskRepository.delete({_id: id});
    return task;
  }
}
