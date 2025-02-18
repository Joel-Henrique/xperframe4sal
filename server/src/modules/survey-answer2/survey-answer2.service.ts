import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {SurveyAnswer} from './entity/survey-answer.entity';
import {Repository} from 'typeorm';
import {CreateSurveyAnswerDto} from './dto/create-surveyAnswer.dto';
import {User2Service} from '../user2/user2.service';
import {Survey2Service} from '../survey2/survey2.service';
import {UpdateSurveyAnswerDto} from './dto/update-surveyAnswer.dto';

@Injectable()
export class SurveyAnswer2Service {
  constructor(
    @InjectRepository(SurveyAnswer)
    private readonly surveyAnswerRepository: Repository<SurveyAnswer>,
    private readonly userService: User2Service,
    private readonly surveyService: Survey2Service,
  ) {}

  async create(
    createSurveyAnswerDto: CreateSurveyAnswerDto,
  ): Promise<SurveyAnswer> {
    const {userId, surveyId} = createSurveyAnswerDto;
    const user = await this.userService.findOne(userId);
    const survey = await this.surveyService.findOne(surveyId);
    //TODO User ou survey nao encontrado
    return await this.surveyAnswerRepository.save({
      user: user,
      survey: survey,
    });
  }

  async findAll(): Promise<SurveyAnswer[]> {
    return await this.surveyAnswerRepository.find();
  }

  async findByUserId(userId: string): Promise<SurveyAnswer[]> {
    return await this.surveyAnswerRepository.find({
      where: {
        user_id: userId,
      },
    });
  }

  async findByUserIdAndSurveyId(
    userId: string,
    surveyId: string,
  ): Promise<SurveyAnswer> {
    return await this.surveyAnswerRepository.findOne({
      where: {user_id: userId, survey_id: surveyId},
    });
  }

  async removeByUserIdAndSurveyId(userId: string, surveyId: string) {
    return await this.surveyAnswerRepository.delete({
      user_id: userId,
      survey_id: surveyId,
    });
  }

  async remove(id: string) {
    return await this.surveyAnswerRepository.delete({_id: id});
  }

  async update(
    id: string,
    updateSurveyAnswerDto: UpdateSurveyAnswerDto,
  ): Promise<SurveyAnswer> {
    try {
      const {userId, surveyId} = updateSurveyAnswerDto;
      await this.surveyAnswerRepository.update(
        {_id: id},
        //TODO arrumar para incluir outras colunas da tabela
        {user_id: userId, survey_id: surveyId},
      );
      return await this.surveyAnswerRepository.findOne({where: {_id: id}});
    } catch (error) {
      throw error;
    }
  }
}
