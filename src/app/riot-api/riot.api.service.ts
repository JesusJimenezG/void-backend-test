import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class RiotAPIService {
  private readonly logger = new Logger(RiotAPIService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async fetchSummonerByName(region: string, name: string) {
    const summonerName = name.replace(' ', '');
    const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;
    const data = await this.fetchFromRiotAPI(url);
    return data;
  }

  async fetchLeagueBySummonerId(region: string, summonerId: string) {
    const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
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
