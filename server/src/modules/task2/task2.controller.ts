import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {Task2Service} from './task2.service';
import {Task} from './entities/task.entity';
import {CreateTaskDto} from './dto/create-task.dto';

@Controller('task2')
export class Task2Controller {
  constructor(private readonly taskService: Task2Service) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return await this.taskService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() task: Task): Promise<Task> {
    //TODO
    //task.lastChangedAt = new Date();
    return await this.taskService.update(id, task);
  }

  @Delete('id')
  async remove(@Param('id') id: string) {
    return await this.taskService.remove(id);
  }
}
