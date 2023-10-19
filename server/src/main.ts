import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { writeFileSync } from 'node:fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // middleware
  app.use(helmet());

  // OpenApi swagger doc
  const config = new DocumentBuilder()
    .setTitle('MarketSim')
    .setDescription('The marketsim api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./openapi/swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
