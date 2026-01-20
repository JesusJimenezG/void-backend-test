import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Summoner } from '../entities/summoner.entity';
import { RiotAPIService } from '../../riot-api/riot.api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSummonerDto, UpdateSummonerDto } from '../dto/summoner.dto';

@Injectable()
export class SummonerService {
  constructor(
    @InjectRepository(Summoner)
    private summonerRepository: Repository<Summoner>,
    private readonly riotService: RiotAPIService,
  ) {}

  async create(
    region: string,
    summonerDTO: CreateSummonerDto,
  ): Promise<Summoner> {
    try {
      summonerDTO.region = region;
      const summoner = this.summonerRepository.create(summonerDTO);
      await this.summonerRepository.insert(summoner);
      return summoner;
    } catch (error) {
      throw new HttpException(
        `Error at creating Summoner`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findAll(region: string) {
    return this.summonerRepository.find({
      where: {
        region: region,
      },
    });
  }

  async findByRiotId(region: string, gameName: string, tagLine: string) {
    // Robustly handle cases where gameName might contain the tag
    let finalGameName = gameName;
    let finalTagLine = tagLine;

    if (gameName.includes('#')) {
      const [n, t] = gameName.split('#');
      finalGameName = n;
      finalTagLine = t; // Override tagLine if it was in the name
    }

    const riotId = `${finalGameName}#${finalTagLine}`;

    // Update variables for subsequent use in the same function
    gameName = finalGameName;
    tagLine = finalTagLine;

    // 1. Try to find by PUUID if we have it? No, we don't know PUUID yet.
    // We can check by name (RiotID) if we stored it that way.
    let summoner = await this.summonerRepository.findOne({
      where: {
        name: riotId,
        region: region,
      },
    });

    if (!summoner) {
      // 2. Fetch Account (PUUID) from Riot API
      try {
        const accountData = await this.riotService.fetchAccountByRiotId(
          region,
          gameName,
          tagLine,
        );

        // 3. Check DB by PUUID just in case name changed
        summoner = await this.summonerRepository.findOne({
          where: { puuid: accountData.puuid, region },
        });

        if (!summoner) {
          // 4. Fetch Summoner Details by PUUID
          // NOTE: Some regions/keys might return partial data without 'id'.
          // We use PUUID as fallback ID if necessary.
          const summonerData = await this.riotService.fetchSummonerByPuuid(
            region,
            accountData.puuid,
          );

          if (!summonerData.id) {
            summonerData.id = summonerData.puuid;
          }
          if (!summonerData.accountId) {
            summonerData.accountId = summonerData.puuid;
          }

          // 5. Create new summoner record
          const newSummoner: CreateSummonerDto = {
            ...summonerData,
            name: riotId,
            region: region,
            gameName: gameName,
            tagLine: tagLine,
          };

          summoner = await this.create(region, newSummoner);
        } else {
          // If we found by PUUID but name, gameName or tagLine were different, update them
          if (
            summoner.name !== riotId ||
            summoner.gameName !== gameName ||
            summoner.tagLine !== tagLine
          ) {
            await this.update(region, summoner.name, {
              ...summoner,
              name: riotId,
              gameName: gameName,
              tagLine: tagLine,
            });
            summoner.name = riotId;
            summoner.gameName = gameName;
            summoner.tagLine = tagLine;
          }
        }
      } catch (error) {
        throw new InternalServerErrorException(
          `Could not fetch summoner ${riotId} from Riot API: ${error.message}`,
        );
      }
    }
    return summoner;
  }

  /**
   * @deprecated Use findByRiotId instead
   */
  async findBySummonerName(region: string, summonerName: string) {
    // Legacy support check
    return this.summonerRepository.findOne({
      where: { name: summonerName, region },
    });
  }

  update(
    region: string,
    summonerName: string,
    updateSummonerDto: UpdateSummonerDto,
  ) {
    return this.summonerRepository.update(
      { name: summonerName, region: region },
      updateSummonerDto,
    );
  }

  remove(region: string, summonerName: string) {
    return this.summonerRepository.delete({ region, name: summonerName });
  }
}
