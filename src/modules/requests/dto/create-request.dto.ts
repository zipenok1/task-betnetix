import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateRequestDto {
    @IsString({message: 'mac должен быть строкой'})
    @IsNotEmpty({message: 'mac обязателен для заполнения'})
    mac!: string

    @IsUUID()
    @IsNotEmpty({message: 'shopId обязателен для заполнения'})
    shopId!: string

    @IsString({message: 'comment должен быть строкой'})
    @IsOptional()
    comment!: string
}