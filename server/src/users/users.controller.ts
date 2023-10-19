import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';
import { ToggleWatchListDto } from './dto/toggle-watchList.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Get user if exists, create new user if not' })
  @ApiOkResponse({ type: User, description: 'Existing user' })
  @ApiCreatedResponse({ type: User, description: 'New user' })
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    let user = await this.usersService.findOne(createUserDto.sub);
    if (user) {
      res.status(200).json(user);
      return;
    }
    user = await this.usersService.create(createUserDto);
    return user;
  }

  @Get()
  @ApiOperation({ summary: 'Get a specific user' })
  async findOne(@Req() req: Request): Promise<User> {
    const id = req.auth.payload.sub;
    const user = await this.usersService.findOneOrFail(id);
    return user;
  }

  @Patch('/toggleWatchList')
  @ApiOperation({ summary: 'Add or remove item from watch list' })
  @ApiOkResponse({
    description: 'Returns watch list array containing 0-n ticker symbols',
  })
  async toggleWatchList(
    @Body() toggleDto: ToggleWatchListDto,
    @Req() req: Request,
  ): Promise<string[]> {
    const id = req.auth.payload.sub;
    try {
      const watchList = await this.usersService.toggleWatchList(id, toggleDto);
      return watchList;
    } catch (error) {
      throw new InternalServerErrorException('Failure to update watch list');
    }
  }

  @Patch()
  @ApiOperation({ summary: 'Update user' })
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const id = req.auth.payload.sub;
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Req() req: Request) {
    const id = req.auth.payload.sub;
    const user = await this.usersService.findOneOrFail(id);
    await this.usersService.remove(user);
  }
}
