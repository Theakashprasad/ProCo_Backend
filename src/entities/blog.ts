export class Blog {
    constructor(
      public readonly about: string,
      public readonly image: string[],
      public readonly email: string,
      public readonly block: boolean,
    ) {}
  }
  