import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { GLOBAL_PREFIX, SWAGGER } from './config/constants';
import { swaggerBuilder } from './swagger/swagger.builder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);
  const swaggerConfig = swaggerBuilder();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${SWAGGER.path}`, app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
