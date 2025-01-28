//import {StepsType} from 'src/modules/experiments2/entity/experiment.entity';

import {IsNotEmpty, IsString} from 'class-validator';

export class CreateUserExperimentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  experimentId: string;
  //stepsCompleted: Record<StepsType, boolean>;
}
