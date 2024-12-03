import {BaseEntity} from 'src/model/base_entity2';
import {Column, Entity} from 'typeorm';

@Entity()
export class Task extends BaseEntity {
  @Column()
  title: string;
  @Column()
  summary: string;
  @Column()
  description: string;
}
