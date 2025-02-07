import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose'; import { ExperimentsModule } from './modules/experiments/experiments.module';
import { IcfModule } from './modules/icf/icf.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserExperimentsModule } from './modules/user-experiments/user-experiments.module';
import { SurveysModule } from './modules/surveys/surveys.module';
import { UserSurveysModule } from './modules/survey-answers/survey-answers.module';
import { UserTasksModule } from './modules/user-tasks/user-tasks.module';
import { HttpModule } from './modules/http/http.module';
import { GoogleModule } from './modules/search-engines/google/google.module';
import { UserTaskSessionModule } from './modules/user-task-session/user-task-session.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ExperimentsModule,
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
    SurveysModule,
    MongooseModule.forRoot(process.env.MONGO ? process.env.MONGO : 'mongodb://localhost:27017',
      {
        dbName: 'cbf',
      }
    ),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }