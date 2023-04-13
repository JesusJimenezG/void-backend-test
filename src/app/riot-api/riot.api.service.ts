import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateSummonerDto } from '../summoner/dto/create-summoner.dto';
import { CreateLeagueDto } from '../league/dto/league.dto';
import { MatchDto } from '../match/dto/match.dto';
import { REGIONS, SERVERS } from 'src/config/constants';
import { getServer } from './riot.api.utils';

@Injectable()
export class RiotAPIService {
  private readonly logger = new Logger(RiotAPIService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async fetchSummonerByName(
    region: string,
    summonerName: string,
  ): Promise<CreateSummonerDto> {
    const urlName = summonerName.replace(' ', '');
    const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlName}`;
    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  async fetchLeagueBySummonerId(
    region: string,
    summonerId: string,
  ): Promise<CreateLeagueDto[]> {
    const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  async fetchMatchesBySummonerPuuid(
    region: string,
    puuid: string,
    startTime?: number,
    endTime?: number,
    queue?: number,
    type?: string,
    start = 0,
    count = 20,
  ): Promise<string[]> {
    console.log('region from the request: ', region);
    const server = getServer(region);
    console.log('server: ', server);
    const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;

    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  async fetchMatchByMatchId(
    region: string,
    matchId: string,
  ): Promise<MatchDto> {
    const server = getServer(region);
    console.log('server: ', server);
    const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  async fetchFromRiotAPI(url: string) {
    const token = this.configService.get<string>('RIOT_API_KEY');
    const response = await this.httpService
      .get(url, {
        headers: {
          'X-Riot-Token': token,
        },
      })
      .pipe(
        catchError((error) => {
          this.logger.error(error);
          throw error;
        }),
      );
    const { data } = await firstValueFrom(response);
    return data;
  }
}
