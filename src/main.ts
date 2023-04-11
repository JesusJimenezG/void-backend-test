import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { SWAGGER } from './config/constants';
import { swaggerBuilder } from './config/swagger.builder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = swaggerBuilder();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`api/${SWAGGER.path}`, app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
