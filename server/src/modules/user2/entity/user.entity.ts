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
  @Column()
  birthDate: Date;
  @Column()
  recoveryPasswordToken: string;
  @Column()
  recoveryPasswordTokenExpirationDate: Date;
  @Column()
  pesquisador: boolean;
}
