import { Injectable } from '@nestjs/common';

import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      return new User(user);
    }

    return null;
  }

  async create({ email, name, password, role }: CreateUserDto): Promise<User> {
    const passwordHash = await this.hashService.hash(password);

    const user = await this.prismaService.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        role,
      },
    });

    return new User(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const formattedUsers = users.map((user) => new User(user));

    return formattedUsers;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user with ${JSON.stringify(updateUserDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
