import { IsString, IsOptional } from 'class-validator';

export class UpdateCredentialsDto {
    @IsString()
    @IsOptional()
    login?: string

    @IsString()
    @IsOptional()
    password?: string
}