import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsStrongPassword({
    minLength: 1,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 0,
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
