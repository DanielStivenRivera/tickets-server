import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          __dirname + '/**/*.entity.ts',
          __dirname + '/**/*.entity.js',
        ],
        migrations: [
          '__dirname' + '/migrations/*.ts',
          '__dirname' + '/migrations/*.js',
        ],
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false, ca: configService.get('DB_SSL_CA') }
            : false,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
