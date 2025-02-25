import {BaseEntity} from 'src/model/base_entity2';
import {Experiment} from 'src/modules/experiments2/entity/experiment.entity';
import {Survey} from 'src/modules/survey2/entity/survey.entity';
import {UserTask} from 'src/modules/user-task2/entities/user-tasks.entity';
import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';

@Entity()
export class Task extends BaseEntity {
  @Column()
  title: string;
  @Column()
  summary: string;
  @Column()
  description: string;
  @ManyToOne(() => Experiment, (experiment) => experiment.tasks, {
    nullable: true,
  })
  experiment: Experiment;
  @Column()
  experiment_id: string;

  @ManyToOne(() => Survey, (survey) => survey.tasks, {
    nullable: true,
  })
  survey: Survey;
  @Column()
  survey_id: string;

  @OneToMany(() => UserTask, (userTask) => userTask.task)
  userTasks: UserTask[];
}
