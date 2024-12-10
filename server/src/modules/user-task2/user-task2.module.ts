import {Module} from '@nestjs/common';
import {UserTask2Service} from './user-task2.service';
import {UserTask2Controller} from './user-task2.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserTask} from './entities/user-tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTask])],
  providers: [UserTask2Service],
  controllers: [UserTask2Controller],
})
export class UserTask2Module {}
