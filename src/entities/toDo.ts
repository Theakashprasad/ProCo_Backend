export class Todo {
 
  constructor(
    public readonly text: string,
    public readonly status: boolean,
    public readonly completedOn: string,
    public readonly userId: string
  ) {}
}
