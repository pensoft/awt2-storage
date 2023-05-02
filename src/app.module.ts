import { Module } from '@nestjs/common';
import { getEnvPath } from './common/utils/env.helper';
import { ConfigModule } from '@nestjs/config';
import { MainModule } from './modules/main.module';

const envFilePath: string = getEnvPath(`${__dirname}/..`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    MainModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
