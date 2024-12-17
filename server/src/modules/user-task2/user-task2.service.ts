import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserTask} from './entities/user-tasks.entity';
import {Repository} from 'typeorm';
import {CreateUserTaskDto} from './dto/create-userTask.dto';
import {User2Service} from '../user2/user2.service';
import {Task2Service} from '../task2/task2.service';

@Injectable()
export class UserTask2Service {
  constructor(
    @InjectRepository(UserTask)
    private readonly userTaskRepository: Repository<UserTask>,

    private readonly userService: User2Service,
    private readonly taskService: Task2Service,
  ) {}
  async findOne(id: string): Promise<UserTask> {
    try {
      return await this.userTaskRepository.findOne({
        where: {
          _id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async create(createUserTaskDto: CreateUserTaskDto): Promise<UserTask> {
    const {userId, taskId} = createUserTaskDto;
    const user = await this.userService.findOne(userId);
    const task = await this.taskService.findOne(taskId);
    const newUserTask = this.userTaskRepository.create({
      user,
      task,
    });
    return await this.userTaskRepository.save(newUserTask);
  }

  async createMany(userTasks: UserTask[]): Promise<UserTask[]> {
    try {
      const savedUserTasks = await this.userTaskRepository.save(userTasks);
      return savedUserTasks;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<UserTask[]> {
    return await this.userTaskRepository.find();
  }
  async findByUserId(userId: string): Promise<UserTask[]> {
    return await this.userTaskRepository.find({
      where: {
        user: {_id: userId},
      },
    });
  }

  async findByUserIdAndTaskId(
    userId: string,
    taskId: string,
  ): Promise<UserTask> {
    return await this.userTaskRepository.findOne({
      where: {
        user: {_id: userId},
        task: {_id: taskId},
      },
    });
  }

  async removeByUserIdAndTaskId(
    userId: string,
    taskId: string,
  ): Promise<UserTask> {
    const result = this.findByUserIdAndTaskId(userId, taskId);
    await this.userTaskRepository.delete({
      user: {_id: userId},
      task: {_id: taskId},
    });
    return result;
  }

  async remove(id: string) {
    const result = this.userTaskRepository.findOne({
      where: {
        _id: id,
      },
    });
    await this.userTaskRepository.delete({_id: id});
    return result;
  }

  async update(id: string, userTask: UserTask): Promise<UserTask> {
    await this.userTaskRepository.update({_id: id}, userTask);
    return await this.userTaskRepository.findOne({where: {_id: id}});
  }

  async start(id: string, userTask: UserTask): Promise<UserTask> {
    userTask.isPaused = false;
    userTask.startTime = new Date();
    await this.update(id, userTask);
    return await this.userTaskRepository.findOne({where: {_id: id}});
  }

  /*TODO finalizar depois de finalizar entity userTask(tabelas de TIME)
  async pause(id: string, userTask: UserTask): Promise<UserTask> {
    
  }

  async resume(id: string, userTask: UserTask): Promise<UserTask> {}*/

  async finish(id: string, userTaks: UserTask): Promise<UserTask> {
    userTaks.hasFinishedTask = true;
    userTaks.endTime = new Date();
    await this.update(id, userTaks);
    return await this.userTaskRepository.findOne({where: {_id: id}});
  }
}
