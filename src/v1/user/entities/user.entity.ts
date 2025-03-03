import { randomUUID } from 'node:crypto';

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export const UserRole = { ADMIN: 'ADMIN', USER: 'USER' } as const;
export type UserRoleType = keyof typeof UserRole;

export class User {
  @ApiProperty({ example: randomUUID() })
  @Expose()
  id: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  name: string;

  @Exclude()
  passwordHash: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  @Expose()
  role: UserRoleType;

  @ApiProperty({ example: new Date(), name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: new Date(), name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
