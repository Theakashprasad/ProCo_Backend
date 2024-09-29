interface Answer {
  userId: string;
  content: string;
}
export class Question {
    constructor(
      public readonly question: string,
      public readonly name: string,
      public readonly answers: Answer[],
      public readonly communityId: string,
    ) {}
  }
