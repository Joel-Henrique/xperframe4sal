import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {Survey2Service} from './survey2.service';
import {CreateSurveyDto} from './dto/create-survey.dto';
import {Survey} from './entity/survey.entity';
import {UpdateSurveyDto} from './dto/update-survey.dto';

@Controller('survey2')
export class Survey2Controller {
  constructor(private readonly surveyService: Survey2Service) {}

  //@UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createSurveyDto: CreateSurveyDto): Promise<Survey> {
    return await this.surveyService.create(createSurveyDto);
  }
  //@UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Survey[]> {
    return await this.surveyService.findAll();
  }
  //@UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Survey> {
    return await this.surveyService.findOne(id);
  }
  //@UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ): Promise<Survey> {
    return await this.surveyService.update(id, updateSurveyDto);
  }
  //@UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.surveyService.remove(id);
  }
}
