import { DocumentBuilder } from '@nestjs/swagger';
import { SWAGGER } from './constants';

export const swaggerBuilder = () => {
  const builder = new DocumentBuilder()
    .setTitle(SWAGGER.title)
    .setDescription(SWAGGER.description)
    .setVersion(SWAGGER.version);
  SWAGGER.tags.forEach((tag) => builder.addTag(tag));

  return builder.build();
};
