import { Injectable } from '@nestjs/common';
import { P2p } from './schema/p2p.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    ApproveOrderP2pDto,
    CancelOrderP2pDto,
    OrderP2pDto,
    P2pDto,
} from './dto/p2p.dto';
import { P2pTransaction } from './schema/p2p-transaction.schema';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class P2pService {
    constructor(
        @InjectModel(P2p.name) private p2pModel: Model<P2p>,
        @InjectModel(P2pTransaction.name) private p2pTransactionModel: Model<P2pTransaction>,
        private walletService: WalletService,
    ) {
        console.log('P2p Service created');
    }

    async createP2p(data: P2pDto): Promise<any> {
        const findP2p = await this.p2pModel
            .findOne({ wallet_id: data.walletId, currency: data.currency })
            .lean()
            .exec();

        console.log(findP2p);

        if (findP2p) {
            return {
                isError: true,
                message: 'This currency already exists',
            };
        }

        const sub = await this.walletService.subtractCurrencyFromWallet(
            data.walletId,
            data.currency,
            data.amount,
        );

        if (sub.isError) {
            return {
                isError: true,
                message: sub.message,
            };
        }

        const dataToSave = {
            wallet_id: data.walletId,
            currency: data.currency,
            amount: data.amount,
            price: data.price,
        };

        const p2p = new this.p2pModel(dataToSave);
        await p2p.save();

        return {
            isError: false,
            message: 'Create success',
        };
    }

    async orderP2p(data: OrderP2pDto): Promise<any> {
        const findP2p = await this.p2pModel
            .findOne({ _id: new Types.ObjectId(data.p2pId) })
            .lean()
            .exec();

        if (!findP2p) {
            return {
                isError: true,
                message: 'This currency does not exist',
            };
        }

        if (findP2p.amount < data.amount) {
            return {
                isError: true,
                message: 'Not enough currency',
            };
        }

        await this.p2pModel.updateOne(
            { _id: new Types.ObjectId(data.p2pId) },
            { $inc: { amount: -data.amount } },
        );

        await this.p2pTransactionModel.create({
            p2p_id: String(findP2p._id),
            amount: data.amount,
            status: 'pending',
            buyer_wallet_id: data.buyerWalletId,
        });

        return {
            isError: false,
            message: 'Order success',
        };
    }

    async approveP2p(data: ApproveOrderP2pDto): Promise<any> {
        const findP2pTransaction = await this.p2pTransactionModel
            .findOne({ _id: new Types.ObjectId(data.p2pTransactionId), status: 'pending' })
            .lean()
            .exec();

        if (!findP2pTransaction) {
            return {
                isError: true,
                message: 'This transaction does not exist',
            };
        }

        await this.p2pTransactionModel.updateOne(
            { _id: data.p2pTransactionId },
            { status: 'approved' },
        );

        const findP2p = await this.p2pModel
            .findOne({ _id: new Types.ObjectId(findP2pTransaction.p2p_id) })
            .lean()
            .exec();

        if (!findP2p) {
            return {
                isError: true,
                message: 'This currency does not exist',
            };
        }

        await this.walletService.addCurrencyToWallet(
            findP2pTransaction.buyer_wallet_id,
            findP2p.currency,
            findP2pTransaction.amount,
        );

        return {
            isError: false,
            message: 'Approve success',
        };
    }

    async cancelP2p(data: CancelOrderP2pDto): Promise<any> {
        const findP2pTransaction = await this.p2pTransactionModel
            .findOne({ _id: new Types.ObjectId(data.p2pTransactionId), status: 'pending' })
            .lean()
            .exec();

        if (!findP2pTransaction) {
            return {
                isError: true,
                message: 'This transaction does not exist',
            };
        }

        await this.p2pTransactionModel.updateOne(
            { _id: data.p2pTransactionId },
            { status: 'canceled' },
        );

        await this.p2pModel.updateOne(
            { _id: findP2pTransaction.p2p_id },
            { $inc: { amount: findP2pTransaction.amount } },
        );

        return {
            isError: false,
            message: 'Cancel success',
        };
    }
}
