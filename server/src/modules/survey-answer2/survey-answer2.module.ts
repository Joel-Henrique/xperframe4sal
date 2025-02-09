import {Module} from '@nestjs/common';
import {SurveyAnswer2Service} from './survey-answer2.service';
import {SurveyAnswer2Controller} from './survey-answer2.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SurveyAnswer} from './entity/survey-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyAnswer])],
  providers: [SurveyAnswer2Service],
  controllers: [SurveyAnswer2Controller],
})
export class SurveyAnswer2Module {}
