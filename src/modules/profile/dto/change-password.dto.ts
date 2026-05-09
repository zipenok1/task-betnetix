import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsString({message: 'oldPassword должен быть строкой'})
    @MinLength(4, {message: 'oldPassword должен содержать не меньше 4 символов'})
    oldPassword!: string

    @IsString({message: 'newPassword должен быть строкой'})
    @MinLength(4, {message: 'newPassword должен содержать не меньше 4 символов'})
    newPassword!: string
}