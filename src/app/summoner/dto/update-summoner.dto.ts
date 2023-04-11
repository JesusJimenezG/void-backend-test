import { PartialType } from '@nestjs/swagger';
import { CreateSummonerDto } from './create-summoner.dto';

export class UpdateSummonerDto extends PartialType(CreateSummonerDto) {
  profileIconId: number;
  revisionDate: number;
  name: string;
  summonerLevel: number;
}
