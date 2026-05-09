import { IsString, IsNotEmpty } from 'class-validator';

export class HeartbeatDto {
    @IsString({message: 'mac должен быть строкой'})
    @IsNotEmpty({message: 'mac обязателен для заполнения'})
    mac!: string

    @IsString({message: 'shopLogin должен быть строкой'})
    @IsNotEmpty({message: 'shopLogin обязателен для заполнения'})
    shopLogin!: string

    @IsString({message: 'shopPassword должен быть строкой'})
    @IsNotEmpty({message: 'shopPassword обязателен для заполнения'})
    shopPassword!: string
}