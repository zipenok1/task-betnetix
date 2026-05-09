import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateShopDto {
    @IsString({message: 'name должен быть строкой'})
    @IsNotEmpty({message: 'name обязателен для заполнения'})
    name!: string

    @IsString({message: 'address должен быть строкой'})
    @IsNotEmpty({message: 'address обязателен для заполнения'})
    address!: string

    @IsString({message: 'login должен быть строкой'})
    @IsNotEmpty({message: 'login обязателен для заполнения'})
    login!: string

    @IsString({message: 'password должен быть строкой'})
    @IsNotEmpty({message: 'password обязателен для заполнения'})
    password!: string

    @IsUUID()
    @IsNotEmpty({message: 'ownerId обязателен для заполнения'})
    ownerId!: string

    @IsOptional()
    legalDetails?: any
}