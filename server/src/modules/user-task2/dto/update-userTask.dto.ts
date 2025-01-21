import {IntersectionType, PartialType} from '@nestjs/mapped-types';
import {CreateUserTaskDto} from './create-userTask.dto';
import {TimeEditUserTaskDto} from './timeEditUserTaskDTO';

export class UpdateUserTaskDto extends PartialType(
  IntersectionType(CreateUserTaskDto, TimeEditUserTaskDto),
) {}
