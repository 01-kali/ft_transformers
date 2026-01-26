import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto{
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  age: number;

  @IsString()
  @IsNotEmpty()
  email: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
