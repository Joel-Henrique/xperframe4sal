import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Survey} from './entity/survey.entity';
import {Repository} from 'typeorm';
import {CreateSurveyDto} from './dto/create-survey.dto';
import {UpdateSurveyDto} from './dto/update-survey.dto';

@Injectable()
export class Survey2Service {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  async create(createSurveyDto: CreateSurveyDto): Promise<Survey> {
    try {
      const newSurvey = await this.surveyRepository.save(createSurveyDto);
      return newSurvey;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Survey[]> {
    return await this.surveyRepository.find();
  }
  async findOne(id: string): Promise<Survey> {
    return await this.surveyRepository.findOne({
      where: {_id: id},
    });
  }
  async update(id: string, updateSurveyDto: UpdateSurveyDto): Promise<Survey> {
    try {
      await this.surveyRepository.update({_id: id}, updateSurveyDto);
      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }
  async remove(id: string) {
    const survey = await this.findOne(id);
    await this.surveyRepository.delete({_id: id});
    return survey;
  }
}
