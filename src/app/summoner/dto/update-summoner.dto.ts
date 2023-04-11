import { PartialType } from '@nestjs/swagger';
import { CreateSummonerDto } from './create-summoner.dto';

export class UpdateSummonerDto extends PartialType(CreateSummonerDto) {
  accountId: string;
  profileIconId: number;
  revisionDate: number;
  name: string;
  id: string;
  puuid: string;
  summonerLevel: number;
  region: string;
}
