import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  create(region: string, summonerDTO: CreateSummonerDto): Summoner {
    try {
      summonerDTO.region = region;
      const summoner = this.summonerRepository.create(summonerDTO);
      this.summonerRepository.insert(summoner);
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

  async findBySummonerName(region: string, summonerName: string) {
    let summoner = await this.summonerRepository.findOne({
      where: {
        name: summonerName,
        region: region,
      },
    });

    if (!summoner) {
      // Fetch summoner from Riot API
      const data = await this.riotService.fetchSummonerByName(
        region,
        summonerName,
      );
      // Save summoner to database
      let newSummoner = new CreateSummonerDto();
      newSummoner = { ...summoner, ...data, region: region };
      summoner = await this.create(region, newSummoner);
    }
    return summoner;
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
