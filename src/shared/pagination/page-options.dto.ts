import { ApiPropertyOptional } from '@nestjs/swagger';
import { Order, Queues } from '../constants/constants';

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Queues, default: Queues.ALL })
  readonly queueId?: Queues = Queues.ALL;

  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
