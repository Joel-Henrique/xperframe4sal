import {Module} from '@nestjs/common';
import {UserExperiments2Service} from './user-experiments2.service';
import {UserExperiments2Controller} from './user-experiments2.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserExperiment} from './entities/user-experiments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserExperiment])],
  providers: [UserExperiments2Service],
  controllers: [UserExperiments2Controller],
})
export class UserExperiments2Module {}
