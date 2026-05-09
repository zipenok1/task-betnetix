import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator"


export class CreateOwnersDto{
    @IsString({message: 'name должен быть строкой'})
    @IsNotEmpty({message: 'name обязателен для заполнения'})
    name!: string

    @IsString({ message: 'phone должен быть строкой' })
    @IsNotEmpty({ message: 'phone обязателен для заполнения' })
    @Matches(/^\+?[0-9]{10,15}$/, { 
        message: 'phone должен быть в формате +79999999999 или 79999999999' 
    })
    phone!: string

    @IsString({message: 'email должен быть строкой'})
    @IsEmail({}, {message: 'некорректный формат email'})
    @IsOptional()
    email?: string

}