import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserTask} from './entities/user-tasks.entity';
import {Repository} from 'typeorm';
import {CreateUserTaskDto} from './dto/create-userTask.dto';
import {User2Service} from '../user2/user2.service';
import {Task2Service} from '../task2/task2.service';
import {UpdateUserTaskDto} from './dto/update-userTask.dto';
import {TimeEditUserTaskDto} from './dto/timeEditUserTaskDTO';

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

  async update(
    id: string,
    updateUserTaskDto: UpdateUserTaskDto,
  ): Promise<UserTask> {
    await this.userTaskRepository.update({_id: id}, updateUserTaskDto);
    return await this.userTaskRepository.findOne({where: {_id: id}});
  }

  async start(
    id: string,
    timeEditUserTaskDTO: TimeEditUserTaskDto,
  ): Promise<UserTask> {
    let {isPaused, startTime} = timeEditUserTaskDTO;
    isPaused = false;
    startTime = new Date();
    await this.update(id, {isPaused, startTime});
    return await this.userTaskRepository.findOne({where: {_id: id}});
  }

  async pause(
    id: string,
    timeEditUserTaskDto: TimeEditUserTaskDto,
  ): Promise<UserTask> {
    let {isPaused, pauseTime} = timeEditUserTaskDto;
    isPaused = true;
    if (!pauseTime) {
      pauseTime = [];
    }
    pauseTime.push(new Date());
    return await this.update(id, {isPaused, pauseTime});
  }

  async resume(
    id: string,
    timeEditUserTaskDTO: TimeEditUserTaskDto,
  ): Promise<UserTask> {
    let {isPaused, resumeTime} = timeEditUserTaskDTO;
    isPaused = false;
    if (!resumeTime) {
      resumeTime = [];
    }
    resumeTime.push(new Date());
    return await this.update(id, {isPaused, resumeTime});
  }

  async finish(
    id: string,
    timeEditUserTaskDTO: TimeEditUserTaskDto,
  ): Promise<UserTask> {
    let {hasFinishedTask, endTime} = timeEditUserTaskDTO;
    hasFinishedTask = true;
    endTime = new Date();
    await this.update(id, {hasFinishedTask, endTime});
    return await this.userTaskRepository.findOne({where: {_id: id}});
  }
}
