import { ApiProperty } from '@nestjs/swagger';

export class Candle {
  @ApiProperty({ description: 'List of close prices' })
  c: number[];
  @ApiProperty({ description: 'List of high prices' })
  h: number[];
  @ApiProperty({ description: 'List of low prices' })
  l: number[];
  @ApiProperty({ description: 'List of open prices' })
  o: number[];
  @ApiProperty({ description: 'Response status: ok or no_data' })
  s: string;
  @ApiProperty({ description: 'List of timestamps' })
  t: number[];
  @ApiProperty({ description: 'List of volume data' })
  v: number[];
}
