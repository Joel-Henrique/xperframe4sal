import {BaseEntity} from 'src/model/base_entity2';
import {Column, Entity} from 'typeorm';

/*enum SurveyType {
  PRE = 'pre',
  POST = 'post',
  OTHER = 'other',
}*/

/*export enum StepsType {
  ICF = 'icf',
  PRE = 'pre',
  POST = 'post',
  TASK = 'task',
}*/
@Entity()
export class Experiment extends BaseEntity {
  @Column()
  name: string;
  @Column()
  summary: string;
}
