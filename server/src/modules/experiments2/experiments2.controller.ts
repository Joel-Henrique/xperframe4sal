import {Body, Controller, Delete, Get, Param, Patch} from '@nestjs/common';
import {Experiments2Service} from './experiments2.service';
import {Experiment} from './entity/experiment.entity';

@Controller('experiments2')
export class Experiments2Controller {
  constructor(private readonly experimentService: Experiments2Service) {}

  //TODO
  //@Post()
  //async create()

  //UseGuards(AuthGuard('jwt'))
  @Get()
  async findall(): Promise<Experiment[]> {
    return await this.experimentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Experiment> {
    return await this.experimentService.find(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() experiment: Experiment,
  ): Promise<Experiment> {
    //TODO
    //experiment.lastChangeAt = new Date()
    return await this.experimentService.update(id, experiment);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.experimentService.remove(id);
  }
}
