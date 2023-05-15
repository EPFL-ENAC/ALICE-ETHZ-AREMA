import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { prisma } from '../prisma/prisma';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createProfileDto: CreateUserDto): Promise<User> {
    // return this.usersRepository.save(
    //   this.usersRepository.create(createProfileDto),
    // );
    const { name, email } = req.body

    const newUser = await prisma.user.create({
      data: {
        id,
        email,
      },
    })

    res.send(newUser);
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return prisma.user.findMany({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  // findOne(fields: EntityCondition<User>) {
  //   return prisma.user.findUniqueOrThrow({
  //     where: fields,
  //   });
  // }

  // update(id: number, payload: DeepPartial<User>): Promise<User> {
  //   return prisma.user.update(
  //     this.usersRepository.create({
  //       id,
  //       ...payload,
  //     }),
  //   );
  // }

  async softDelete(id: number): Promise<void> {
    // await this.usersRepository.softDelete(id);
  }
}
