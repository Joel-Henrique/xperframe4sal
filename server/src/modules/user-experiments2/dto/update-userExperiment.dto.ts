import {PartialType} from '@nestjs/mapped-types';
import {CreateUserExperimentDto} from './create-userExperiment.dto';

export class UpdateUserExperimentDto extends PartialType(
  CreateUserExperimentDto,
) {}
