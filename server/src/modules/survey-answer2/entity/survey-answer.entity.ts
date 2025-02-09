import {BaseEntity} from 'src/model/base_entity2';
import {Survey} from 'src/modules/survey2/entity/survey.entity';
import {User} from 'src/modules/user2/entity/user.entity';
import {Column, Entity, ManyToOne} from 'typeorm';

@Entity()
export class SurveyAnswer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.surveyAnswers)
  user: User;
  @Column()
  user_id: string;

  @ManyToOne(() => Survey, (survey) => survey.surveyAnswers)
  survey: Survey;
  @Column()
  survey_id: string;

  @Column({type: 'jsonb'})
  answers: any[];

  @Column({type: 'float'})
  score: number;
}
