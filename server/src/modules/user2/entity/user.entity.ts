import {BaseEntity} from 'src/model/base_entity2';
import {UserExperiment} from 'src/modules/user-experiments2/entities/user-experiments.entity';
import {Column, Entity, OneToMany} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;
  @Column()
  lastName: string;
  @Column({unique: true, nullable: false})
  email: string;
  @Column({nullable: false})
  password: string;
  @Column({nullable: true})
  birthDate: Date;
  @Column({nullable: true})
  recoveryPasswordToken: string;
  @Column({nullable: true})
  recoveryPasswordTokenExpirationDate: Date;
  @Column({nullable: true})
  pesquisador: boolean;
  @OneToMany(() => UserExperiment, (userExperiment) => userExperiment.user)
  userExperiments: UserExperiment[];
}
