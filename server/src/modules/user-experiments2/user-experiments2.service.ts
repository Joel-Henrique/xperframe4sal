import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserExperiment} from './entities/user-experiments.entity';
import {Repository} from 'typeorm';

@Injectable()
export class UserExperiments2Service {
  constructor(
    @InjectRepository(UserExperiment)
    private readonly userExperimentRepository: Repository<UserExperiment>,
  ) {}

  async create(userExperiment: UserExperiment): Promise<UserExperiment> {
    try {
      const newUserExperiment =
        this.userExperimentRepository.create(userExperiment);
      newUserExperiment.stepsCompleted = {
        icf: false,
        pre: false,
        post: false,
        task: false,
      };
      const savedUserExperiment =
        await this.userExperimentRepository.save(newUserExperiment);
      return savedUserExperiment;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<UserExperiment[]> {
    return await this.userExperimentRepository.find();
  }

  async findByUserId(userId: string): Promise<UserExperiment[]> {
    return await this.userExperimentRepository.find({
      where: {user: {_id: userId}},
    });
  }

  async findByUserAndExperimentId(
    userId: string,
    experimentId: string,
  ): Promise<UserExperiment> {
    return await this.userExperimentRepository.findOne({
      where: {
        user: {_id: userId},
        experiment: {_id: experimentId},
      },
    });
  }

  async update(
    id: string,
    userExperiment: UserExperiment,
  ): Promise<UserExperiment> {
    await this.userExperimentRepository.update({_id: id}, userExperiment);
    return await this.userExperimentRepository.findOne({
      where: {
        _id: id,
      },
    });
  }

  async removeByUserIdAndExperimentId(userId: string, experimentId: string) {
    const result = await this.findByUserAndExperimentId(userId, experimentId);
    await this.userExperimentRepository.delete({
      user: {_id: userId},
      experiment: {_id: experimentId},
    });
    return result;
  }

  async remove(id: string) {
    const result = await this.userExperimentRepository.findOne({
      where: {
        _id: id,
      },
    });
    await this.userExperimentRepository.delete({_id: id});
    return result;
  }
}
