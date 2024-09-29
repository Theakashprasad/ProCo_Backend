interface Member {
  userId: string;
  status: string;
}

export class Community {
  constructor(
    public readonly name: string,
    public readonly creator: string,
    public readonly members: Member[],
    public readonly profilePic: string
  ) {}
}
