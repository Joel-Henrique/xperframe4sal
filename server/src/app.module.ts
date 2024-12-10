import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {ExperimentsModule} from './modules/experiments/experiments.module';
import {IcfModule} from './modules/icf/icf.module';
import {TasksModule} from './modules/tasks/tasks.module';
import {UserModule} from './modules/user/user.module';
import {AuthModule} from './modules/auth/auth.module';
import {UserExperimentsModule} from './modules/user-experiments/user-experiments.module';
import {SurveysModule} from './modules/surveys/surveys.module';
import {UserSurveysModule} from './modules/survey-answers/survey-answers.module';
import {UserTasksModule} from './modules/user-tasks/user-tasks.module';
import {HttpModule} from './modules/http/http.module';
import {GoogleModule} from './modules/search-engines/google/google.module';
import {PuppeteerModule} from './modules/puppeteer/puppeteer.module';
import {UserTaskSessionModule} from './modules/user-task-session/user-task-session.module';
import {MailerModule} from '@nestjs-modules/mailer';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User2Module} from './modules/user2/user2.module';
import {User} from './modules/user2/entity/user.entity';
import {Experiments2Module} from './modules/experiments2/experiments2.module';
import {Experiment} from './modules/experiments2/entity/experiment.entity';
import {Task2Module} from './modules/task2/task2.module';
import {Task} from './modules/task2/entities/task.entity';
import {UserExperiments2Module} from './modules/user-experiments2/user-experiments2.module';
import {UserExperiment} from './modules/user-experiments2/entities/user-experiments.entity';
import {UserTask2Module} from './modules/user-task2/user-task2.module';
import {UserTask} from './modules/user-task2/entities/user-tasks.entity';
@Module({
  imports: [
    ExperimentsModule,
    ConfigModule.forRoot({
      //isso é para o funcionamento do set SECRET no .env
      isGlobal: true,
    }),
    IcfModule,
    TasksModule,
    UserModule,
    AuthModule,
    UserExperimentsModule,
    UserSurveysModule,
    UserTasksModule,
    UserTaskSessionModule,
    HttpModule,
    GoogleModule,
    PuppeteerModule,
    SurveysModule,
    MongooseModule.forRoot(
      process.env.MONGO ? process.env.MONGO : 'mongodb://localhost:27017',
      {
        dbName: 'cbf',
      },
    ),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'cbf',
      entities: [User, Experiment, Task, UserExperiment, UserTask],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
        },
      },
    }),
    User2Module,
    Experiments2Module,
    Task2Module,
    UserExperiments2Module,
    UserTask2Module,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
