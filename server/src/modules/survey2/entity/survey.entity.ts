import {BaseEntity} from 'src/model/base_entity2';
import {Column, Entity} from 'typeorm';

@Entity()
export class Survey extends BaseEntity {
  @Column()
  name: string;
  @Column()
  title: string;
  @Column()
  description: string;
  //TODO questions
}
