import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateAdminDto {
    @IsString({message: 'password должен быть строкой'})
    @IsNotEmpty({message: 'password обязателен для заполнения'})
    @MinLength(4, {message: 'password должен содержать не меньше 4 символов'})
    password!: string  
}