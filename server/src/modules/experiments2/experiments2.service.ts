import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Experiment} from './entity/experiment.entity';
import {Repository} from 'typeorm';
import {CreateExperimentDto} from './dto/create-experiment.dto';
//import {Task} from '../task2/entities/task.entity';
import {UserExperiment} from '../user-experiments2/entities/user-experiments.entity';
import {UserExperiments2Service} from '../user-experiments2/user-experiments2.service';
import {UserTask2Service} from '../user-task2/user-task2.service';
import {UpdateExperimentDto} from './dto/update-experiment.dto';

@Injectable()
export class Experiments2Service {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
    @Inject(forwardRef(() => UserExperiments2Service))
    private readonly userExperimentService: UserExperiments2Service,
    private readonly userTaskService: UserTask2Service,
  ) {}

  //TODO

  async create(createExperimentDto: CreateExperimentDto): Promise<any> {
    const {name, summary, tasksProps, userProps} = createExperimentDto;

    const experiment = await this.experimentRepository.create({name, summary});
    const savedExperiment = await this.experimentRepository.save(experiment);

    //UserExperiment
    const userExperimentPromises = Object.keys(userProps).map((userId) => {
      return this.userExperimentService.create({
        userId,
        experimentId: savedExperiment._id,
      });
    });

    const userExperiments: UserExperiment[] = await Promise.all(
      userExperimentPromises,
    );
    await this.userExperimentService.createMany(userExperiments);

    //UserTask
    const userTasksPromises = Object.keys(tasksProps).flatMap((taskId) => {
      return Object.keys(userProps).map((userId) => {
        return this.userTaskService.create({
          userId,
          taskId,
        });
      });
    });
    const userTaks = await Promise.all(userTasksPromises);
    await this.userTaskService.createMany(userTaks);
    return savedExperiment;
  }

  async findAll(): Promise<Experiment[]> {
    return await this.experimentRepository.find();
  }

  async find(id: string): Promise<Experiment> {
    return await this.experimentRepository.findOneBy({_id: id});
  }

  async findOneByName(name: string): Promise<Experiment> {
    return await this.experimentRepository.findOneBy({name});
  }

  async update(
    id: string,
    updateExperimentDto: UpdateExperimentDto,
  ): Promise<Experiment> {
    try {
      await this.experimentRepository.update({_id: id}, updateExperimentDto);
      const result = await this.find(id);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: string) {
    const experiment = await this.find(id);
    await this.experimentRepository.delete({_id: id});
    return experiment;
  }
}
