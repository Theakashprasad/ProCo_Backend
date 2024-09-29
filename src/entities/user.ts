export class User {
  isBlocked: any;
  _id: any;

  constructor(
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly otp: number,
    public readonly isVerified: boolean,
    public readonly payment: boolean,
    public readonly paymentDate: string,
    public readonly role: string
  ) {}
}

export class Admin {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}

// used  to retive data  in repro
