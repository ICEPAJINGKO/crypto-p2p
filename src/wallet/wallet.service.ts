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
                isError: false,
                message: 'Wallet created successfully',
                data: saved,
            };
        } else {
            return {
                isError: true,
                message: 'Failed to create wallet',
                data: null,
            };
        }
    }

    async addCurrencyToWallet(walletId: string, currency: string, amount: number): Promise<Record<string, any>> {
        const wallet = await this.walletModel.findOne({ wallet_id: walletId }).lean().exec();

        if (!wallet) {
            return {
                isError: true,
                message: 'Wallet not found',
                data: null,
            };
        }

        // +เพิ่มจำนวนเงินในกระเป๋า
        const updated = await this.walletModel.updateOne(
            { wallet_id: walletId },
            { $inc: { [currency]: amount } },
        );

        if (updated) {
            return {
                isError: false,
                message: 'Currency added successfully',
                data: updated,
            };
        } else {
            return {
                isError: true,
                message: 'Failed to add currency',
                data: null,
            };
        };

    }

    async subtractCurrencyFromWallet(walletId: string, currency: string, amount: number): Promise<Record<string, any>> {
        const wallet = await this.walletModel.findOne({ wallet_id: walletId }).lean().exec();

        if (!wallet) {
            return {
                isError: true,
                message: 'Wallet not found',
                data: null,
            };
        }

        // -ลดจำนวนเงินในกระเป๋า
        const updated = await this.walletModel.updateOne(
            { wallet_id: walletId },
            { $inc: { [currency]: -amount } },
        );

        if (updated) {
            return {
                isError: false,
                message: 'Currency subtracted successfully',
                data: updated,
            };
        } else {
            return {
                isError: true,
                message: 'Failed to subtract currency',
                data: null,
            };
        };
    }
}
