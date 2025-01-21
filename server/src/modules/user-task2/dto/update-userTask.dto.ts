import {IntersectionType, PartialType} from '@nestjs/mapped-types';
import {CreateUserTaskDto} from './create-userTask.dto';
import {PauseAndResumeDto} from './pauseAndResume.dto';

export class UpdateUserTaskDto extends PartialType(
  IntersectionType(CreateUserTaskDto, PauseAndResumeDto),
) {}
