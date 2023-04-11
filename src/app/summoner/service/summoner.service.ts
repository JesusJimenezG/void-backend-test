import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSummonerDto } from '../dto/create-summoner.dto';
// import { UpdateSummonerDto } from '../dto/update-summoner.dto';
import { Repository } from 'typeorm';
import { Summoner } from '../entities/summoner.entity';
import { REPOSITORIES } from 'src/config/constants';
import { RiotAPIService } from 'src/app/riot-api/riot.api.service';

@Injectable()
export class SummonerService {
  private readonly logger = new Logger(SummonerService.name);
  constructor(
    @Inject(REPOSITORIES.SUMMONER)
    private summonerRepository: Repository<Summoner>,
    private readonly riotService: RiotAPIService,
  ) {}

  create(createSummonerDto: CreateSummonerDto) {
    return this.summonerRepository.insert(createSummonerDto);
  }

  // findAll() {
  //   return this.summonerRepository.find();
  // }

  async findOne(name: string, region: string) {
    const summoner = await this.summonerRepository.findOne({
      select: { name: true, region: true },
      where: { name: name, region: region },
    });
    if (!summoner) {
      // Fetch summoner from Riot API
      const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`;
      const data = await this.riotService.fetchFromRiotAPI(url);
      // Save summoner to database
      let newSummoner = new CreateSummonerDto();
      newSummoner = { ...summoner, ...data, region: region };
      this.create(newSummoner);
    }

    return summoner;
  }

  // update(uuid: string, updateSummonerDto: UpdateSummonerDto) {
  //   return this.summonerRepository.update({ uuid: uuid }, updateSummonerDto);
  // }

  // remove(uuid: string) {
  //   return this.summonerRepository.softDelete({ uuid: uuid });
  // }
}
