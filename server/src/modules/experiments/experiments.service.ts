import { Injectable } from '@nestjs/common';
import { Experiment } from '../../model/experiment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class ExperimentsService {
  constructor(
    @InjectModel('Experiments')
    private readonly _experimentModel: Model<Experiment>,
  ) { }

  async create(experiment: Experiment): Promise<Experiment> {
    const newExperiment = new this._experimentModel(experiment);
    return await newExperiment.save();
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
