import { IsNumber, IsString, IsEmail, IsInteger } from 'class-validator';

eport class signuodto{
  @IsString()
  @IsEmail()
  email: string;
  @IsNumber()
  @IsInteger()
  age: number;
}
