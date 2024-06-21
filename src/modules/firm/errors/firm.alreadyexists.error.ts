import { HttpException, HttpStatus } from '@nestjs/common';

export class FirmAlreadyExistsException extends HttpException {
  constructor() {
    super('Firm name is already taken', HttpStatus.CONFLICT);
  }
}

export class TaxIdNumberDuplicateException extends HttpException {
  constructor() {
    super('Tax ID number is duplicated', HttpStatus.CONFLICT);
  }
}
