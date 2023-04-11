import { Inject, Injectable } from '@nestjs/common';
import { CreateSummonerDto } from '../dto/create-summoner.dto';
import { UpdateSummonerDto } from '../dto/update-summoner.dto';
import { Repository } from 'typeorm';
import { Summoner } from '../entities/summoner.entity';

@Injectable()
export class SummonerService {
  constructor(
    @Inject('SUMMONER_REPOSITORY')
    private summonerRepository: Repository<Summoner>,
  ) {}

  create(createSummonerDto: CreateSummonerDto) {
    return 'This action adds a new summoner';
  }

  findAll() {
    return `This action returns all summoner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} summoner`;
  }

  update(id: number, updateSummonerDto: UpdateSummonerDto) {
    return `This action updates a #${id} summoner`;
  }

  remove(id: number) {
    return `This action removes a #${id} summoner`;
  }
}
