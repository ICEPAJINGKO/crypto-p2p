import { Injectable } from '@nestjs/common';
import { ICreateWallet } from './wallet.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './schema/wallet.schema';
import { Model, Types } from 'mongoose';

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

    async addCurrencyToWallet(
        walletId: string,
        currency: string,
        amount: number,
    ): Promise<Record<string, any>> {
        const wallet = await this.walletModel
            .findOne({ _id: new Types.ObjectId(walletId) })
            .lean()
            .exec();

        if (!wallet) {
            return {
                isError: true,
                message: 'Wallet not found',
                data: null,
            };
        }

        // +เพิ่มจำนวนเงินในกระเป๋า
        const updated = await this.walletModel.updateOne(
            { _id: new Types.ObjectId(walletId) },
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
        }
    }

    async subtractCurrencyFromWallet(
        walletId: string,
        currency: string,
        amount: number,
    ): Promise<Record<string, any>> {
        const wallet = await this.walletModel
            .findOne({ _id: new Types.ObjectId(walletId) })
            .lean()
            .exec();

        console.log("=============> wallet :", wallet);

        if (!wallet) {
            return {
                isError: true,
                message: 'Wallet not found',
                data: null,
            };
        }

        if (wallet[currency] < amount) {
            return {
                isError: true,
                message: 'Not enough currency',
                data: null,
            };
        }

        // -ลดจำนวนเงินในกระเป๋า
        const updated = await this.walletModel.updateOne(
            { _id: new Types.ObjectId(walletId) },
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
        }
    }
}
