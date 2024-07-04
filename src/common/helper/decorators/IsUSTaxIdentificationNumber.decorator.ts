import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsUSTaxIdentificationNumberConstraint
  implements ValidatorConstraintInterface
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(taxIdNumber: string, args: ValidationArguments) {
    return /^(?:\d{3}-\d{2}-\d{4}|\d{2}-\d{7})$/.test(taxIdNumber);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Tax Identification Number must be a valid US TIN (SSN or EIN).';
  }
}

export function IsUSTaxIdentificationNumber(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUSTaxIdentificationNumberConstraint,
    });
  };
}
