import {Module} from '@nestjs/common';
import {Experiments2Service} from './experiments2.service';
import {Experiments2Controller} from './experiments2.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Experiment} from './entity/experiment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment])],
  providers: [Experiments2Service],
  controllers: [Experiments2Controller],
})
export class Experiments2Module {}
