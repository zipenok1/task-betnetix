import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginDto{
    @IsString({message: 'email должен быть строкой'})
    @IsEmail({}, {message: 'некорректный формат email'})
    @IsNotEmpty({message: 'email обязателен для заполнения'})
    email!: string

    @IsString({message: 'password должен быть строкой'})
    @IsNotEmpty({message: 'password обязателен для заполнения'})
    @MinLength(4, {message: 'password должен содержать не меньше 4 символов'})
    password!: string
}