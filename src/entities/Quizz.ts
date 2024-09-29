interface IQuizOtpion {
  option: string;
}

interface IQuizQuestion {
  question: string;
  options: IQuizOtpion[];
  correctAnswer: string;
}
export class Quizz {
  constructor(
    public readonly name: string,
    public readonly communityId: string,
    public readonly questions: IQuizQuestion[]
  ) {}
}
