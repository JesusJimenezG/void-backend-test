import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { GLOBAL_PREFIX, SWAGGER } from './shared/constants/constants';
import { swaggerBuilder } from './swagger/swagger.builder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix(GLOBAL_PREFIX);
  const swaggerConfig = swaggerBuilder();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${SWAGGER.path}`, app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
