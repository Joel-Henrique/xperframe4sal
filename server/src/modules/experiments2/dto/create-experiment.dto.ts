import {UserProps} from 'src/model/experiment.entity';
import {SurveyProps, TaskProps} from '../entity/experiment.entity';

export class CreateExperimentDto {
  name: string;
  ownerId: string;
  summary: string;
  //TODO Ver como fazer a relação
  //tasks: Task[];
  tasksProps: TaskProps[];
  userProps: UserProps[];
  surveyProps: Record<string, SurveyProps>;
}
