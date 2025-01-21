import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {UserTask2Service} from './user-task2.service';
import {UserTask} from './entities/user-tasks.entity';
import {CreateUserTaskDto} from './dto/create-userTask.dto';
import {UpdateUserTaskDto} from './dto/update-userTask.dto';
//import { AuthGuard } from '@nestjs/passport';

@Controller('user-task2')
export class UserTask2Controller {
  constructor(private readonly userTaskService: UserTask2Service) {}

  //@UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserTask> {
    return await this.userTaskService.findOne(id);
  }
  @Get()
  async findAll(
    @Query('userId') userId: string,
    @Query('taskId') taskId: string,
  ): Promise<UserTask[] | UserTask> {
    if (userId) {
      if (taskId) {
        return await this.userTaskService.findByUserIdAndTaskId(userId, taskId);
      }
      return await this.userTaskService.findByUserId(userId);
    }
    return await this.userTaskService.findAll();
  }

  //@UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createUserTaskDto: CreateUserTaskDto,
  ): Promise<UserTask> {
    return await this.userTaskService.create(createUserTaskDto);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Delete()
  async removeByUserIdAndTaskId(
    @Query('userId') userId: string,
    @Query('taskId') taskId: string,
  ): Promise<UserTask> {
    if (userId) {
      if (taskId) {
        return await this.userTaskService.removeByUserIdAndTaskId(
          userId,
          taskId,
        );
      }
    }
    return null;
  }
  //@UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserTask> {
    return await this.userTaskService.remove(id);
  }
  //@UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserTaskDto: UpdateUserTaskDto,
  ): Promise<UserTask> {
    return await this.update(id, updateUserTaskDto);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Patch(':id/start')
  async start(@Param('id') id: string): Promise<UserTask> {
    const userTask = await this.userTaskService.findOne(id);
    const isPaused = userTask.isPaused;
    const startTime = userTask.startTime;
    return await this.userTaskService.start(id, {isPaused, startTime});
  }
  @Patch(':id/pause')
  async pause(@Param('id') id: string): Promise<UserTask> {
    const userTask = await this.userTaskService.findOne(id);
    const isPaused = userTask.isPaused;
    const pauseTime = userTask.pauseTime;
    return await this.userTaskService.pause(id, {isPaused, pauseTime});
  }
  @Patch(':id/resume')
  async resume(@Param('id') id: string): Promise<UserTask> {
    const userTask = await this.userTaskService.findOne(id);
    const isPaused = userTask.isPaused;
    const resumeTime = userTask.resumeTime;
    return await this.userTaskService.resume(id, {isPaused, resumeTime});
  }

  @Patch(':id/finish')
  async finish(@Param('id') id: string): Promise<UserTask> {
    const userTask = await this.userTaskService.findOne(id);
    const hasFinishedTask = userTask.hasFinishedTask;
    const endTime = userTask.endTime;
    return await this.userTaskService.finish(id, {hasFinishedTask, endTime});
  }
}
