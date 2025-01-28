import {IsNotEmpty, IsString} from 'class-validator';

export class CreateUserTaskDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  taskId: string;
}
