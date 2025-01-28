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
import {ApiOperation, ApiTags, ApiBody, ApiQuery} from '@nestjs/swagger';
import {UserTask2Service} from './user-task2.service';
import {UserTask} from './entities/user-tasks.entity';
import {CreateUserTaskDto} from './dto/create-userTask.dto';
import {UpdateUserTaskDto} from './dto/update-userTask.dto';

@ApiTags('user-task2')
@Controller('user-task2')
export class UserTask2Controller {
  constructor(private readonly userTaskService: UserTask2Service) {}

  @Get(':id')
  @ApiOperation({summary: 'Get a user task by id'})
  async findOne(@Param('id') id: string): Promise<UserTask> {
    return await this.userTaskService.findOne(id);
  }

  @Get()
  @ApiOperation({summary: 'Get all user tasks or filter by userId and taskId'})
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'User ID',
  })
  @ApiQuery({
    name: 'taskId',
    required: false,
    type: String,
    description: 'Task ID',
  })
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

  @Post()
  @ApiOperation({summary: 'Create a new user task'})
  @ApiBody({type: CreateUserTaskDto})
  async create(
    @Body() createUserTaskDto: CreateUserTaskDto,
  ): Promise<UserTask> {
    return await this.userTaskService.create(createUserTaskDto);
  }

  @Delete()
  @ApiOperation({summary: 'Remove a user task by userId and taskId'})
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'User ID',
  })
  @ApiQuery({
    name: 'taskId',
    required: true,
    type: String,
    description: 'Task ID',
  })
  async removeByUserIdAndTaskId(
    @Query('userId') userId: string,
    @Query('taskId') taskId: string,
  ): Promise<UserTask> {
    if (userId && taskId) {
      return await this.userTaskService.removeByUserIdAndTaskId(userId, taskId);
    }
    return null;
  }

  @Delete(':id')
  @ApiOperation({summary: 'Remove a user task by id'})
  async remove(@Param('id') id: string): Promise<UserTask> {
    return await this.userTaskService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Update a user task'})
  @ApiBody({type: UpdateUserTaskDto})
  async update(
    @Param('id') id: string,
    @Body() updateUserTaskDto: UpdateUserTaskDto,
  ): Promise<UserTask> {
    return await this.update(id, updateUserTaskDto);
  }

  @Patch(':id/start')
  @ApiOperation({summary: 'Start a user task'})
  async start(@Param('id') id: string): Promise<UserTask> {
    const userTask = await this.userTaskService.findOne(id);
    const isPaused = userTask.isPaused;
    const startTime = userTask.startTime;
    return await this.userTaskService.start(id, {isPaused, startTime});
  }

  @Patch(':id/pause')
  @ApiOperation({summary: 'Pause a user task'})
  async pause(@Param('id') id: string): Promise<UserTask> {
    const userTask = await this.userTaskService.findOne(id);
    const isPaused = userTask.isPaused;
    const pauseTime = userTask.pauseTime;
    return await this.userTaskService.pause(id, {isPaused, pauseTime});
  }

  @Patch(':id/resume')
  @ApiOperation({summary: 'Resume a user task'})
  async resume(@Param('id') id: string): Promise<UserTask> {
    const userTask = await this.userTaskService.findOne(id);
    const isPaused = userTask.isPaused;
    const resumeTime = userTask.resumeTime;
    return await this.userTaskService.resume(id, {isPaused, resumeTime});
  }

  @Patch(':id/finish')
  @ApiOperation({summary: 'Finish a user task'})
  async finish(@Param('id') id: string): Promise<UserTask> {
    const userTask = await this.userTaskService.findOne(id);
    const hasFinishedTask = userTask.hasFinishedTask;
    const endTime = userTask.endTime;
    return await this.userTaskService.finish(id, {hasFinishedTask, endTime});
  }
}
