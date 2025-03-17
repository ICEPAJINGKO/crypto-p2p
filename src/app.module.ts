import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { MongooseModule } from '@nestjs/mongoose';
import { P2pModule } from './p2p/p2p.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        UserModule,
        WalletModule,
        P2pModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
