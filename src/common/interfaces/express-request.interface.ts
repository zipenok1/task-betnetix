import { Request } from 'express';
import { UserPayload } from './user-payload.interface';

export interface ExpressRequest extends Request {
    user: UserPayload
}