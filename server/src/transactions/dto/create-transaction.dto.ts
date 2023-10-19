import { ApiHideProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class CreateTransactionDto {
  @ApiHideProperty()
  user?: User;

  @ApiHideProperty()
  price?: number;

  quantity: number;

  symbol: string;

  type: string;
}
