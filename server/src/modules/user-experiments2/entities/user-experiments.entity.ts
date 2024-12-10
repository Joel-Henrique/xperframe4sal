import {BaseEntity} from 'src/model/base_entity2';
import {Experiment} from 'src/modules/experiments2/entity/experiment.entity';
import {User} from 'src/modules/user2/entity/user.entity';
import {Entity, ManyToOne} from 'typeorm';

@Entity()
export class UserExperiment extends BaseEntity {
  /* Na documentacao existia essas colunas, porem não acho necessario
  @Column()
  userId: string;
  @Column()
  experimentId: string;*/

  @ManyToOne(() => User, (user) => user.userExperiments)
  user: User;

  @ManyToOne(() => Experiment, (experiment) => experiment.userExperiments)
  experiment: Experiment;
}
