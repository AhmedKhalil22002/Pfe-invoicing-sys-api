import { HttpException, HttpStatus } from '@nestjs/common';

export class StorageBadRequestError extends HttpException {
  constructor(message?: string) {
    super(message || 'Storage bad request', HttpStatus.BAD_REQUEST);
  }
}
