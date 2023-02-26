import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, `../../.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`) });

const url = `${process.env.DB_TYPE}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const DatabaseConfig = registerAs(
  'database',
  () =>
    ({
      /*
    |--------------------------------------------------------------------------
    | Database Connection
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections you wish
    | to use as your default connection for all database work.
    |
    */
      url: process.env.DATABASE_URL || url,
      logging: process.env.DB_LOGGING,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      dropSchema: process.env.DB_DROP_SCHEMA === 'true',
      migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
      migrations: ['dist/database/migrations/**/*{.ts,.js}'],
    } as TypeOrmModuleOptions),
);

console.log('--------------------------------');
console.log('DatabaseConfig', DatabaseConfig());
console.log('--------------------------------');
console.log('NODE_ENV', process.env.NODE_ENV);
console.log('--------------------------------');

export default DatabaseConfig;
