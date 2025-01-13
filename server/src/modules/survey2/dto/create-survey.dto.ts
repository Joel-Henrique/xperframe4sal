enum QuestionType {
  MULTIPLE_CHOICES = 'multiple-choices',
  OPEN = 'open',
  MULTIPLE_SELECTION = 'multiple-selection',
}

class OptionDTO {
  statement: string;
  score: number;
  subQuestion: QuestionDTO[];
  type: string;
  functionName: string;
}

class QuestionDTO {
  statement: string;
  type: QuestionType = QuestionType.MULTIPLE_CHOICES;
  options: OptionDTO[];
  required: boolean;
  otherStatement: string;
  helperText: string;
}

export class CreateSurveyDto {
  name: string;
  title: string;
  description: string;
  questions: QuestionDTO[];
}
