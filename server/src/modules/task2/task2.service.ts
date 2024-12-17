import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './entities/task.entity';
import {Repository} from 'typeorm';
import {CreateTaskDto} from './dto/create-task.dto';
import {Experiments2Service} from '../experiments2/experiments2.service';

@Injectable()
export class Task2Service {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @Inject(forwardRef(() => Experiments2Service))
    private readonly experimentService: Experiments2Service,
  ) {}
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      //TODO implentar criação do relacionamento com experiment
      const {title, summary, description, experimentId} = createTaskDto;
      const experiment = await this.experimentService.find(experimentId);
      const newTask = await this.taskRepository.create({
        title,
        summary,
        description,
        experiment,
      });
      return await this.taskRepository.save(newTask);
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
