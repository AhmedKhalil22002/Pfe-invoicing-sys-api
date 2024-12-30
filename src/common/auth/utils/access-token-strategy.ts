import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectAccessTokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (authorization && authorization.startsWith('Bearer ')) {
      const payload = JSON.parse(atob(authorization.split('.')[1]));
      return payload;
    }
    return null;
  },
);
