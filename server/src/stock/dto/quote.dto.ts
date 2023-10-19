import { ApiProperty } from '@nestjs/swagger';

export class Quote {
  @ApiProperty({ description: 'Current price' })
  c: number;

  @ApiProperty({ description: 'Change' })
  d: number;

  @ApiProperty({ description: 'Percent change' })
  dp: string;

  @ApiProperty({ description: 'High price of the day' })
  h: number;

  @ApiProperty({ description: 'Low price of the day' })
  l: number;

  @ApiProperty({ description: 'Price at open' })
  o: number;

  @ApiProperty({ description: 'Previous close price' })
  pc: number;

  @ApiProperty({ description: 'Unix timestamp' })
  t: number;
}
