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
import { SummonerService } from '../services/summoner.service';
import { ApiTags } from '@nestjs/swagger';
import { RegionInterceptor } from '../../../shared/interceptors/region.interceptor';
import { CreateSummonerDto, UpdateSummonerDto } from '../dto/summoner.dto';

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

  // @UseInterceptors(CacheInterceptor)
  @Get(':region/summoners')
  findAll(@Param('region') region: string) {
    return this.summonerService.findAll(region);
  }

  // @UseInterceptors(CacheInterceptor)
  // @UseInterceptors(CacheInterceptor)
  @Get(':region/:gameName/:tagLine')
  findByRiotId(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
  ) {
    return this.summonerService.findByRiotId(region, gameName, tagLine);
  }

  @Patch(':region/:gameName/:tagLine')
  update(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
    @Body() updateSummonerDto: UpdateSummonerDto,
  ) {
    const summonerName = `${gameName}#${tagLine}`;
    return this.summonerService.update(region, summonerName, updateSummonerDto);
  }

  @Delete(':region/:gameName/:tagLine')
  remove(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
  ) {
    const summonerName = `${gameName}#${tagLine}`;
    return this.summonerService.remove(region, summonerName);
  }
}
