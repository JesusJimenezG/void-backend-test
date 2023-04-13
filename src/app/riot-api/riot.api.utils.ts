import { REGIONS, SERVERS } from '../../config/constants';

export const getServer = (region: string) => {
  let server;
  switch (region.toUpperCase()) {
    case REGIONS.NA1:
    case REGIONS.BR1:
    case REGIONS.LA1:
    case REGIONS.LA2:
      server = SERVERS.AMERICAS.toLocaleLowerCase();
      break;
    case REGIONS.KR:
    case REGIONS.JP1:
      server = SERVERS.ASIA.toLocaleLowerCase();
      break;
    case REGIONS.EUW1:
    case REGIONS.EUN1:
    case REGIONS.RU:
    case REGIONS.TR1:
      server = SERVERS.EUROPE.toLocaleLowerCase();
      break;
    case REGIONS.OC1:
    case REGIONS.PH2:
    case REGIONS.SG2:
    case REGIONS.TH2:
    case REGIONS.TW2:
    case REGIONS.VN2:
      server = SERVERS.ASIA.toLocaleLowerCase();
      break;
    default:
      server = SERVERS.ASIA.toLocaleLowerCase();
      break;
  }
  return server;
};
