import {BaseEntity} from 'src/model/base_entity2';
import {Column, Entity} from 'typeorm';

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
}
