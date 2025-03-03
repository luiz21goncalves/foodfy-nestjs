import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsError extends ConflictException {
  constructor(identifier: string) {
    super(`User with the identifier ${identifier} already exists.`);
  }
}
