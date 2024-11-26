import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
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
