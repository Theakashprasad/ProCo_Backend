interface users {
    userId: string;
    date: string;
  }
  export class ProPayment {
      constructor(
        public readonly proId: string,
        public readonly name: string,
        public readonly users: users[],
        public readonly status: boolean,
        public readonly amount: number,
      ) {}
    }
  