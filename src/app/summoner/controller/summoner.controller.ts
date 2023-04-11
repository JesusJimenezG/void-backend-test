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
// import { UpdateSummonerDto } from '../dto/update-summoner.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Summoner')
@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Post()
  create(@Body() createSummonerDto: CreateSummonerDto) {
    return this.summonerService.create(createSummonerDto);
  }

  // @Get()
  // findAll() {
  //   return this.summonerService.findAll();
  // }

  @Get(':region/:summoner')
  findOne(
    @Param('region') region: string,
    @Param('summoner') summonerName: string,
  ) {
    return this.summonerService.findOne(summonerName, region);
  }

  // @Patch(':uuid')
  // update(
  //   @Param('uuid') uuid: string,
  //   @Body() updateSummonerDto: UpdateSummonerDto,
  // ) {
  //   return this.summonerService.update(uuid, updateSummonerDto);
  // }

  // @Delete(':uuid')
  // remove(@Param('uuid') uuid: string) {
  //   return this.summonerService.remove(uuid);
  // }
}
