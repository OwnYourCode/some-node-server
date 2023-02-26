import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { ApiModule } from './api/api.module';
import { AppService } from './app.service';

// TODO: use dynamic config with .env - ??? or maybe use .json file - ??? I'm thinking about it
// TODO: use migrations instead of `synchronization: true` all the time in ormconfig.json file

@Module({
  imports: [ConfigModule, DatabaseModule, LoggerModule, ApiModule],
  providers: [AppService],
})
export class AppModule {}
