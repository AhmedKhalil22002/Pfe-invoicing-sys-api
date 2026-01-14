import { Request } from 'express';

export interface AdvancedRequest extends Request {
  user?: {
    sub: string;
    email: string;
  };
  logInfo?: Record<string, unknown>;
  notificationInfo?: Record<string, unknown>;
}

export interface SocketPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
