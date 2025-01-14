import {Module} from '@nestjs/common';
import {Survey2Controller} from './survey2.controller';
import {Survey2Service} from './survey2.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Survey} from './entity/survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  controllers: [Survey2Controller],
  providers: [Survey2Service],
  exports: [Survey2Service],
})
export class Survey2Module {}
