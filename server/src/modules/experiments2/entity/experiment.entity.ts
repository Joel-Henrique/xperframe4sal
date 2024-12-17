import {BaseEntity} from 'src/model/base_entity2';
import {Task} from 'src/modules/task2/entities/task.entity';
import {UserExperiment} from 'src/modules/user-experiments2/entities/user-experiments.entity';
import {Column, Entity, OneToMany} from 'typeorm';

/*enum SurveyType {
  PRE = 'pre',
  POST = 'post',
  OTHER = 'other',
}*/

export class TaskProps {
  id: string;
  toWhom: string = 'all';
  required: boolean = true;
}

export class UserProps {
  id: string;
  name: string;
  email: string;
}

export enum StepsType {
  ICF = 'icf',
  PRE = 'pre',
  POST = 'post',
  TASK = 'task',
}
@Entity()
export class Experiment extends BaseEntity {
  @Column()
  name: string;
  @Column()
  summary: string;
  @OneToMany(() => Task, (task) => task.experiment)
  tasks: Task[];
  @OneToMany(
    () => UserExperiment,
    (userExperiment) => userExperiment.experiment,
  )
  userExperiments: UserExperiment[];
}
