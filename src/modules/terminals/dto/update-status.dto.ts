import { IsEnum } from 'class-validator';

export enum TerminalStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export class UpdateStatusDto {
    @IsEnum(TerminalStatus)
    status!: TerminalStatus
}