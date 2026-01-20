import { PartialType } from '@nestjs/swagger';
export class CreateSummonerDto {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  region: string;
  gameName?: string;
  tagLine?: string;
}

export class UpdateSummonerDto extends PartialType(CreateSummonerDto) {
  profileIconId: number;
  revisionDate: number;
  name: string;
  summonerLevel: number;
}
