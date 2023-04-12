import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SummonerService } from '../service/summoner.service';
import { CreateSummonerDto } from '../dto/create-summoner.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateSummonerDto } from '../dto/update-summoner.dto';

@ApiTags('Summoner')
@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Post(':region')
  create(
    @Param('region') region: string,
    @Body() createSummonerDto: CreateSummonerDto,
  ) {
    return this.summonerService.create(region, createSummonerDto);
  }

  @Get(':region/summoners')
  findAll(@Param('region') region: string) {
    return this.summonerService.findAll(region);
  }

  @Get(':region/:summonerName')
  findOne(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
  ) {
    return this.summonerService.findOne(region, summonerName);
  }

  @Patch(':region/:summonerId')
  update(
    @Param('region') region: string,
    @Param('summonerId') summonerId: string,
    @Body() updateSummonerDto: UpdateSummonerDto,
  ) {
    return this.summonerService.update(region, summonerId, updateSummonerDto);
  }

  @Delete(':region/:summonerId')
  remove(
    @Param('region') region: string,
    @Param('summonerId') summonerId: string,
  ) {
    return this.summonerService.remove(region, summonerId);
  }
}
