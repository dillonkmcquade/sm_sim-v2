import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { StockModule } from './stock/stock.module';
import { auth } from 'express-oauth2-jwt-bearer';
import { dataSourceOptions } from './data-source';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({ isGlobal: true, ttl: 1000, max: 10000 }),
    UsersModule,
    TransactionsModule,
    StockModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const jwtCheck = auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: process.env.AUTH0_DOMAIN,
    });
    consumer.apply(jwtCheck).forRoutes('users', 'transactions');
  }
}
