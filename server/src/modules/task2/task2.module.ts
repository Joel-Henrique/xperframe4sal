import {Module} from '@nestjs/common';
import {Task2Service} from './task2.service';
import {Task2Controller} from './task2.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Task} from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [Task2Service],
  controllers: [Task2Controller],
  exports: [Task2Service],
})
export class Task2Module {}
