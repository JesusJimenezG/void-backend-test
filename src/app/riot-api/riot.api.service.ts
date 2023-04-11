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

  async fetchFromRiotAPI(url: string) {
    const config = {
      headers: {
        'X-Riot-Token': this.configService.get<string>('RIOT_API_KEY'),
      },
    };
    const response = await this.httpService.get(url, config).pipe(
      catchError((error) => {
        this.logger.error(error);
        throw error;
      }),
    );
    const { data } = await firstValueFrom(response);
    return data;
  }
}
