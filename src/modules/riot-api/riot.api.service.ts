import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateLeagueDto } from '../../modules/league/dto/league.dto';
import { MatchDto } from '../match/dto/match.dto';
import { getServer } from './riot.api.utils';
import { CreateSummonerDto } from '../summoner/dto/summoner.dto';

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
    start = 0,
    count = 20,
    queue?: number,
    startTime?: number,
    endTime?: number,
  ): Promise<string[]> {
    console.log('start: ', start);
    console.log('count: ', count);
    console.log('queue: ', queue);
    const server = getServer(region);
    const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${
      queue ? `queue=${queue}&` : ''
    }start=${start}&count=${count}`;

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
