export class Connection {
  constructor(
    public readonly senterId: string,
    public readonly follow: string,
    public readonly receiverId: string

  ) {}
}
