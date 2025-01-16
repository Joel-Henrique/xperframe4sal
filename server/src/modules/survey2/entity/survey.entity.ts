import {BaseEntity} from 'src/model/base_entity2';
import {Experiment} from 'src/modules/experiments2/entity/experiment.entity';
import {Column, Entity, ManyToOne} from 'typeorm';

export enum SurveyType {
  PRE = 'pre',
  POST = 'post',
  OTHER = 'other',
}

@Entity()
export class Survey extends BaseEntity {
  @Column()
  name: string;
  @Column()
  title: string;
  @Column()
  description: string;
  //TODO questions
  @Column({type: 'jsonb'})
  questions: any[];
  @Column({
    type: 'enum',
    enum: SurveyType,
  })
  type: SurveyType = SurveyType.OTHER;
  @Column()
  experiment_id: string;
  @ManyToOne(() => Experiment, (experiment) => experiment.surveys)
  experiment: Experiment;
}
