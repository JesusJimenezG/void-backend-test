import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SummonerService } from '../services/summoner.service';
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
  findBySummonerName(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
  ) {
    return this.summonerService.findBySummonerName(region, summonerName);
  }

  @Patch(':region/:summonerName')
  update(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
    @Body() updateSummonerDto: UpdateSummonerDto,
  ) {
    return this.summonerService.update(region, summonerName, updateSummonerDto);
  }

  @Delete(':region/:summonerName')
  remove(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
  ) {
    return this.summonerService.remove(region, summonerName);
  }
}
