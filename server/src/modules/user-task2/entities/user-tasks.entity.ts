import {BaseEntity} from 'src/model/base_entity2';
import {Task} from 'src/modules/task2/entities/task.entity';
import {User} from 'src/modules/user2/entity/user.entity';
import {Column, Entity, ManyToOne} from 'typeorm';

@Entity()
export class UserTask extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userTasks)
  user: User;
  @ManyToOne(() => Task, (task) => task.userTasks)
  task: Task;
  @Column({default: false})
  hasFinishedTask: boolean = false;
  @Column({default: false})
  isPaused: boolean = false;
  @Column({default: null})
  startTime: Date = null;
  //TODO verificar como fazer isso no TypeORM
  //@Column({type: [Date]})
  //pauseTime: Date[] = [];
  //TODO verificar como fazer isso no TypeORM
  //@Column({type: [Date]})
  //resumeTImeTime: Date[] = [];
  @Column({default: null})
  endTime: Date = null;
}
