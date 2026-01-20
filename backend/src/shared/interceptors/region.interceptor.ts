import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { REGIONS } from '../constants/constants';
import { Observable } from 'rxjs';

@Injectable()
export class RegionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    let region = request.params.region;
    try {
      region = this.validRegion(region);
      request.params.region = region;
      return next.handle();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  validRegion(region: string) {
    const regionUppercase = region.toUpperCase();
    const validRegion = REGIONS[regionUppercase];
    if (!validRegion) {
      throw new Error(`Invalid region: ${region}`);
    }
    return validRegion;
  }
}
