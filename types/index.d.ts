// types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        user_id: string;
        user_role: string[];
        tenant_id: string;
      };
    }
  }
}