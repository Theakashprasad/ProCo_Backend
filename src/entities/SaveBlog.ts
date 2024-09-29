  export class SaveBlog {
    constructor(
      public readonly userId: string,
      public readonly blogId: string[],
    ) {}
  }
 