import {UserProps} from 'src/model/experiment.entity';
import {TaskProps} from '../entity/experiment.entity';
import {CreateSurveyDto} from 'src/modules/survey2/dto/create-survey.dto';

export class CreateExperimentDto {
  name: string;
  ownerId: string;
  summary: string;
  typeExperiment: string;
  betweenExperimentType: string;
  //Ver como fazer a relação
  //tasks: Task[];
  tasksProps: TaskProps[];
  userProps: UserProps[];
  surveysProps: CreateSurveyDto[];
}
