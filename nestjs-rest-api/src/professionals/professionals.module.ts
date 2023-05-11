import { Module } from '@nestjs/common';
import { UsersService } from './professionals.service';
import { UsersController } from './professionals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/professionals.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [IsExist, IsNotExist, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
