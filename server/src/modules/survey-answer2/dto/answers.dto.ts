import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { QuestionType } from "src/modules/survey2/dto/question.dto";

export class AnswerOptionsDTO{
    @IsString()
    statemant: string;

    @IsNumber()
    score: number;
}

export class AnswerDTO{
    @IsString()
    questionStatement: string;

    @IsEnum(QuestionType)
    questionType: QuestionType;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AnswerOptionsDTO)
    @IsOptional()
    selectedOptions?: AnswerOptionsDTO[];
    
    @IsString()
    @IsOptional()
    textAnswer?: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AnswerDTO)
    @IsOptional()
    subAnswer?: AnswerDTO[];

    @IsNumber()
    score: number;
}