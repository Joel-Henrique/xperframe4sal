import {BaseEntity} from 'src/model/base_entity2';
import {Experiment} from 'src/modules/experiments2/entity/experiment.entity';
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
  @OneToMany(() => UserTask, (userTask) => userTask.task)
  userTasks: UserTask[];
}
