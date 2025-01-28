//import {UserProps} from 'src/model/experiment.entity';
import {IsNotEmpty, IsString} from 'class-validator';
import {TaskProps} from '../entity/experiment.entity';
import {CreateSurveyDto} from 'src/modules/survey2/dto/create-survey.dto';

export class CreateExperimentDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  ownerId: string;
  @IsNotEmpty()
  @IsString()
  summary: string;
  @IsNotEmpty()
  @IsString()
  typeExperiment: string;
  @IsNotEmpty()
  @IsString()
  betweenExperimentType: string;
  //Ver como fazer a relação
  //tasks: Task[];
  tasksProps: TaskProps[];
  userProps: string[];
  surveysProps: CreateSurveyDto[];
}
