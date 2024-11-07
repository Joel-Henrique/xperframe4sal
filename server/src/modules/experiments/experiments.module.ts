import { Module } from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';
import { ExperimentSchema } from '../../model/experiment.entity';
import { UserExperimentSchema } from '../../model/user-experiment.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Experiments", schema: ExperimentSchema },
      { name: "UserExperiment", schema: UserExperimentSchema }
    ]),
  ],
  controllers: [ExperimentsController],
  providers: [ExperimentsService],
  exports: [ExperimentsService],
})
export class ExperimentsModule { }
