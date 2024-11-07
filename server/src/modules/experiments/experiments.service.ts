import { Injectable } from '@nestjs/common';
import { Experiment } from '../../model/experiment.entity';
import { UserExperiment } from '../../model/user-experiment.entity'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ExperimentsService {
  constructor(
    @InjectModel('Experiments')
    private readonly _experimentModel: Model<Experiment>,
    @InjectModel('UserExperiment')
    private readonly _userExperimentModel: Model<UserExperiment>
  ) { }

  async create(experiment: Experiment): Promise<Experiment> {
    const userIds = []

    

    Object.keys(experiment.userProps).forEach((userId) => {
      const userProps = experiment.userProps[userId];
      userIds.push(userProps)
    });
    const newExperiment = new this._experimentModel(experiment);
    const _experiment = await newExperiment.save()
    for(let i = 0; i < userIds.length; i++) {
      const userId = userIds[i]
      const userExperiment = new this._userExperimentModel({
        userId: userId,
        experimentId: _experiment._id, 
      });

      await userExperiment.save();
    }

    
    return _experiment
  }

  async findAll(): Promise<Experiment[]> {
    return await this._experimentModel.find().exec();
  }

  async find(id: string): Promise<Experiment> {
    return await this._experimentModel.findById(id);
  }

  async findOneByName(name: string): Promise<Experiment> {
    return await this._experimentModel.findOne({ name: name }).exec();
  }

  async update(id: string, experiment: Experiment): Promise<Experiment> {
    return await this._experimentModel.findByIdAndUpdate(id, experiment, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this._experimentModel.findByIdAndDelete(id).exec();;
  }
}
