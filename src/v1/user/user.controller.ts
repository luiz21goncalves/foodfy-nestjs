import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { BadRequestSchema } from '@/schemas/BadRequestSchema';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { UserService } from './user.service';

@ApiExtraModels(User)
@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBadRequestResponse({
    type: BadRequestSchema,
  })
  @ApiInternalServerErrorResponse({
    example: new InternalServerErrorException().getResponse(),
  })
  @ApiConflictResponse({
    example: new UserAlreadyExistsError('john.doe@example.com').getResponse(),
  })
  @ApiCreatedResponse({
    schema: {
      properties: {
        user: {
          $ref: getSchemaPath(User),
        },
      },
      type: 'object',
    },
  })
  @Post()
  async create(@Body() body: CreateUserDto) {
    const { email, name, password, role } = body;

    const foundUserByEmail = await this.userService.findByEmail(email);

    if (foundUserByEmail) {
      throw new UserAlreadyExistsError(email.toLowerCase());
    }

    const createdUser = await this.userService.create({
      email,
      name,
      password,
      role,
    });

    return { user: createdUser };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
