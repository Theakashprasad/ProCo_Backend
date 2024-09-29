export class Wallet {
      constructor(
        public readonly proId: string,
        public readonly numberOfUsers: number,
        public readonly amount: number,
      ) {}
    }