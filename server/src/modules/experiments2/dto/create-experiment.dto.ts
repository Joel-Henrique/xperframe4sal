import {UserProps} from 'src/model/experiment.entity';
import {SurveyProps, TaskProps} from '../entity/experiment.entity';

export class CreateExperimentDto {
  name: string;
  summary: string;
  //TODO Ver como fazer a relação
  //tasks: Task[];
  tasksProps: Record<string, TaskProps>;
  userProps: Record<string, UserProps>;
  surveyProps: Record<string, SurveyProps>;
}
