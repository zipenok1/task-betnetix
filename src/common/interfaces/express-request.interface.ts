import { Request } from 'express';
import type { UserPayload } from './user-payload.interface';

export interface ExpressRequest extends Request {
  user: UserPayload
}