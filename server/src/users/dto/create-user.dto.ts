import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  nickname?: string;

  @ApiProperty()
  picture?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  phone_number?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  sub?: string;
}
