import { Injectable } from '@nestjs/common';
import { CreateSummonerDto } from '../dto/create-summoner.dto';
import { Repository } from 'typeorm';
import { Summoner } from '../entities/summoner.entity';
import { RiotAPIService } from '../../riot-api/riot.api.service';
import { UpdateSummonerDto } from '../dto/update-summoner.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SummonerService {
  constructor(
    @InjectRepository(Summoner)
    private summonerRepository: Repository<Summoner>,
    private readonly riotService: RiotAPIService,
  ) {}

  create(region: string, summonerDTO: CreateSummonerDto): Summoner {
    summonerDTO.region = region;
    const summoner = this.summonerRepository.create(summonerDTO);
    this.summonerRepository.insert(summoner);
    return summoner;
  }

  findAll(region: string) {
    return this.summonerRepository.find({
      where: {
        region: region,
      },
    });
  }

  async findOne(region: string, name: string) {
    let summoner = await this.summonerRepository.findOne({
      where: {
        name: name,
        region: region,
      },
    });

    if (!summoner) {
      // Fetch summoner from Riot API
      const data = await this.riotService.fetchSummonerByName(region, name);
      // Save summoner to database
      let newSummoner = new CreateSummonerDto();
      newSummoner = { ...summoner, ...data, region: region };
      summoner = await this.create(region, newSummoner);
    }
    return summoner;
  }

  update(
    region: string,
    summonerId: string,
    updateSummonerDto: UpdateSummonerDto,
  ) {
    return this.summonerRepository.update(
      { id: summonerId, region: region },
      updateSummonerDto,
    );
  }

  remove(region: string, summonerId: string) {
    return this.summonerRepository.softDelete({ id: summonerId });
  }
}
