export interface GetUserDto {
  id: string;
  name: string;
  lastName: string;
  email: string;
  researcher: boolean;
}

export interface GetRecoveryPasswordDto {
  id: string;
  recoveryPasswordToken: string;
  recoveryPasswordTokenExpirationDate: Date;
}


export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  password: string;
}
