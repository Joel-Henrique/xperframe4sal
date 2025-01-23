import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserExperiment} from './entities/user-experiments.entity';
import {Repository} from 'typeorm';
import {CreateUserExperimentDto} from './dto/create-userExperiment.dto';
import {User2Service} from '../user2/user2.service';
import {Experiments2Service} from '../experiments2/experiments2.service';
import {UpdateUserExperimentDto} from './dto/update-userExperiment.dto';
import {User} from '../user2/entity/user.entity';

@Injectable()
export class UserExperiments2Service {
  constructor(
    @InjectRepository(UserExperiment)
    private readonly userExperimentRepository: Repository<UserExperiment>,
    private readonly userService: User2Service,
    @Inject(forwardRef(() => Experiments2Service))
    private readonly experimentService: Experiments2Service,
  ) {}

  async create(
    createUserExperimentDto: CreateUserExperimentDto,
  ): Promise<UserExperiment> {
    try {
      const {userId, experimentId} = createUserExperimentDto;
      const user = await this.userService.findOne(userId);
      //return user;
      const experiment = await this.experimentService.find(experimentId);
      const newUserExperiment = this.userExperimentRepository.create({
        user,
        experiment,
      });
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

  async createMany(
    userExperiments: UserExperiment[],
  ): Promise<UserExperiment[]> {
    try {
      const savedUserExperiments =
        await this.userExperimentRepository.save(userExperiments);
      return savedUserExperiments;
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

  async findUsersByExperimentId(experimentId: string): Promise<User[]> {
    const userExperiments = await this.userExperimentRepository.find({
      where: {experiment: {_id: experimentId}},
      relations: ['user'],
    });
    return userExperiments.map((userExperiments) => userExperiments.user);
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
    updateUserExperimentDto: UpdateUserExperimentDto,
  ): Promise<UserExperiment> {
    const {userId, experimentId} = updateUserExperimentDto;
    let user, experiment;
    if (userId) {
      user = await this.userService.findOne(userId);
      if (!user) throw new Error('User not found');
    }

    if (experimentId) {
      experiment = await this.experimentService.find(experimentId);
      if (!experiment) throw new Error('Experiment not found');
    }
    await this.userExperimentRepository.update({_id: id}, {user, experiment});
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
