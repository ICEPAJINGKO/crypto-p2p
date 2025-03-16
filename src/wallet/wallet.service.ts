import { Injectable } from '@nestjs/common';
import { ICreateWallet } from './wallet.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './schema/wallet.schema';
import { Model } from 'mongoose';

@Injectable()
export class WalletService {
    constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {
        console.log('Wallet Service created');
    }

    async createWallet(data: ICreateWallet): Promise<Record<string, any>> {
        const wallet = new this.walletModel(data);

        const saved = await wallet.save();

        if (saved) {
            return {
                isSuccess: true,
                message: 'Wallet created successfully',
                data: saved,
            };
        } else {
            return {
                isSuccess: false,
                message: 'Failed to create wallet',
                data: null,
            };
        }
    }
}
