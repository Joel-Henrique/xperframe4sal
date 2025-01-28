import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import {SurveyType} from '../entity/survey.entity';
import {Type} from 'class-transformer';
enum QuestionType {
  MULTIPLE_CHOICES = 'multiple-choices',
  OPEN = 'open',
  MULTIPLE_SELECTION = 'multiple-selection',
}

class OptionDTO {
  @IsString()
  statement: string;

  @IsNumber()
  score: number;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => QuestionDTO)
  subQuestion: QuestionDTO[];

  @IsString()
  type: string;

  @IsString()
  functionName: string;
}

class QuestionDTO {
  @IsString()
  statement: string;

  @IsEnum(QuestionType)
  type: QuestionType = QuestionType.MULTIPLE_CHOICES;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => OptionDTO)
  options: OptionDTO[];

  @IsBoolean()
  required: boolean;

  @IsString()
  otherStatement: string;

  @IsString()
  helperText: string;
}

export class CreateSurveyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(SurveyType)
  type: SurveyType;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => QuestionDTO)
  questions: QuestionDTO[];

  @IsNotEmpty()
  @IsString()
  experimentId: string;
}
