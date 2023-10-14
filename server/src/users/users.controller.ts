import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error', {
        cause: error,
        description: error.message,
      });
    }
  }

  @Get()
  async findOne(@Req() req: Request): Promise<User> {
    const id = req.auth.payload.sub;
    try {
      const user = await this.usersService.findOne(id);
      return user;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Get('/toggleWatchList')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleWatchList(
    @Body() toggleDto: { ticker: string; isWatched: boolean },
    @Req() req: Request,
  ) {
    const id = req.auth.payload.sub;
    const { isWatched, ticker } = toggleDto;
    try {
      const watchList = await this.usersService.toggleWatchList(
        id,
        isWatched,
        ticker,
      );
      return watchList;
    } catch (error) {
      throw new InternalServerErrorException('Failure to update watch list');
    }
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const id = req.auth.payload.sub;
    const updateResult = await this.usersService.update(id, updateUserDto);
    if (updateResult.affected < 1) {
      throw new InternalServerErrorException('Failure to update user');
    }
  }

  @Delete()
  @HttpCode(204)
  async remove(@Req() req: Request) {
    const id = req.auth.payload.sub;
    try {
      const deleteResult = await this.usersService.remove(id);
      if (deleteResult.affected === 0) {
        throw new InternalServerErrorException('Failure to delete user');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failure to delete user', {
        cause: error,
        description: error.message,
      });
    }
  }
}
