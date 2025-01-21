import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {Experiments2Service} from './experiments2.service';
import {Experiment} from './entity/experiment.entity';
import {CreateExperimentDto} from './dto/create-experiment.dto';
import {UpdateExperimentDto} from './dto/update-experiment.dto';

@Controller('experiments2')
export class Experiments2Controller {
  constructor(private readonly experimentService: Experiments2Service) {}

  @Post()
  async create(
    @Body() createExperimentDto: CreateExperimentDto,
  ): Promise<Experiment> {
    return await this.experimentService.create(createExperimentDto);
  }

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
    @Body() updateExperimentDto: UpdateExperimentDto,
  ): Promise<Experiment> {
    return await this.experimentService.update(id, updateExperimentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.experimentService.remove(id);
  }
}
