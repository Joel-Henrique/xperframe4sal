import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import {OptionDTO} from './option.dto';

enum QuestionType {
  MULTIPLE_CHOICES = 'multiple-choices',
  OPEN = 'open',
  MULTIPLE_SELECTION = 'multiple-selection',
}

export class QuestionDTO {
  @ApiProperty()
  @IsString()
  statement: string;

  @ApiProperty({enum: QuestionType})
  @IsEnum(QuestionType)
  type: QuestionType = QuestionType.MULTIPLE_CHOICES;

  @ApiProperty({type: [OptionDTO]})
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => OptionDTO)
  options: OptionDTO[];

  @ApiProperty()
  @IsBoolean()
  required: boolean;

  @ApiProperty()
  @IsString()
  otherStatement: string;

  @ApiProperty()
  @IsString()
  helperText: string;
}
