import { Module } from '@nestjs/common';
import { P2pController } from './p2p.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { P2pService } from './p2p.service';
import { P2p, P2pSchema } from './schema/p2p.schema';
import {
    P2pTransaction,
    P2pTransactionSchema,
} from './schema/p2p-transaction.schema';
import { WalletModule } from '../wallet/wallet.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: P2p.name, schema: P2pSchema }]),
        MongooseModule.forFeature([
            { name: P2pTransaction.name, schema: P2pTransactionSchema },
        ]),
        WalletModule,
    ],
    controllers: [P2pController],
    providers: [P2pService],
})
export class P2pModule {}
