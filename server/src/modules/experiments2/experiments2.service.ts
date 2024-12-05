import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Experiment} from './entity/experiment.entity';
import {Repository} from 'typeorm';

@Injectable()
export class Experiments2Service {
  constructor(
    @InjectRepository(Experiment)
    private readonly experimentRepository: Repository<Experiment>,
  ) {}

  //TODO
  //async create(experiment: Experiment): Promise<Experiment>{}
  async findAll(): Promise<Experiment[]> {
    return await this.experimentRepository.find();
  }

  async find(id: string): Promise<Experiment> {
    return await this.experimentRepository.findOneBy({_id: id});
  }

  async findOneByName(name: string): Promise<Experiment> {
    return await this.experimentRepository.findOneBy({name});
  }

  async update(id: string, experiment: Experiment): Promise<Experiment> {
    try {
      await this.experimentRepository.update({_id: id}, experiment);
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
