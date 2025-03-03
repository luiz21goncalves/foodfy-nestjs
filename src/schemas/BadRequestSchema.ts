import { ApiProperty } from '@nestjs/swagger';

export class BadRequestSchema {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty({ default: 'Bad Request' })
  error: string;

  @ApiProperty({ example: ['validation error'], type: 'array' })
  message: string[];
}
