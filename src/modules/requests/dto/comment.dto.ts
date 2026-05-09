import { IsString, IsNotEmpty } from 'class-validator';

export class CommentDto {
    @IsString({message: 'comment должен быть строкой'})
    @IsNotEmpty({message: 'comment обязателен для заполнения'})
    comment!: string
}