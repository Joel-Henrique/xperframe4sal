import {BaseEntity} from 'src/model/base_entity2';
import {Experiment} from 'src/modules/experiments2/entity/experiment.entity';
import {Column, Entity, ManyToOne} from 'typeorm';

@Entity()
export class Task extends BaseEntity {
  @Column()
  title: string;
  @Column()
  summary: string;
  @Column()
  description: string;
  @ManyToOne(() => Experiment, (experiment) => experiment.tasks)
  experiment: Experiment;
}
