import { DataSourceOptions, DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*.ts'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
