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

  async fetchAccountByRiotId(
    region: string,
    gameName: string,
    tagLine: string,
  ): Promise<any> {
    const server = getServer(region);
    const url = `https://${server}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  async fetchSummonerByPuuid(
    region: string,
    puuid: string,
  ): Promise<CreateSummonerDto> {
    const url = `https://${region.toLocaleLowerCase()}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  /**
   * @deprecated Use fetchAccountByRiotId then fetchSummonerByPuuid instead
   */
  async fetchSummonerByName(
    region: string,
    summonerName: string,
  ): Promise<CreateSummonerDto> {
    const urlName = summonerName.replace(' ', '');
    const url = `https://${region.toLocaleLowerCase()}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlName}`;
    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  /**
   * Fetches league entries for a player using their PUUID.
   * Uses the updated league-v4 endpoint: /lol/league/v4/entries/by-puuid/{encryptedPUUID}
   */
  async fetchLeagueByPuuid(
    region: string,
    puuid: string,
  ): Promise<CreateLeagueDto[]> {
    const url = `https://${region.toLocaleLowerCase()}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  /**
   * @deprecated Use fetchLeagueByPuuid instead. The by-summoner endpoint has been removed from the Riot API.
   */
  async fetchLeagueBySummonerId(
    region: string,
    summonerId: string,
  ): Promise<CreateLeagueDto[]> {
    // Redirect to warn about deprecation but still attempt the call for backwards compatibility
    this.logger.warn(
      'fetchLeagueBySummonerId is deprecated. Use fetchLeagueByPuuid instead.',
    );
    const url = `https://${region.toLocaleLowerCase()}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
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
    const server = getServer(region);
    const queryParams = new URLSearchParams();
    queryParams.append('start', start.toString());
    queryParams.append('count', count.toString());
    if (queue) queryParams.append('queue', queue.toString());
    if (startTime) queryParams.append('startTime', startTime.toString());
    if (endTime) queryParams.append('endTime', endTime.toString());

    const url = `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${queryParams.toString()}`;

    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  async fetchMatchByMatchId(
    region: string,
    matchId: string,
  ): Promise<MatchDto> {
    const server = getServer(region);
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
        timeout: 10000,
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
