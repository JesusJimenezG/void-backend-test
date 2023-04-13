import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { SummonerService } from '../services/summoner.service';
import { CreateSummonerDto } from '../dto/create-summoner.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateSummonerDto } from '../dto/update-summoner.dto';
import { RegionInterceptor } from 'src/app/utils/region.interceptor';

@ApiTags('Summoner')
@Controller('summoner')
@UseInterceptors(RegionInterceptor)
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Post(':region')
  create(
    @Param('region') region: string,
    @Body() createSummonerDto: CreateSummonerDto,
  ) {
    return this.summonerService.create(region, createSummonerDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('all_summoners')
  @Get(':region/summoners')
  findAll(@Param('region') region: string) {
    return this.summonerService.findAll(region);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('summoner')
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
