import {BaseEntity} from 'src/model/base_entity2';
import {Task} from 'src/modules/task2/entities/task.entity';
import {User} from 'src/modules/user2/entity/user.entity';
import {Entity, ManyToOne} from 'typeorm';

@Entity()
export class UserTask extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userTasks)
  user: User;
  @ManyToOne(() => Task, (task) => task.userTasks)
  task: Task;
}
