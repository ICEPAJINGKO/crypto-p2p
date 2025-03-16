import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'wallets', timestamps: true })
export class Wallet extends Document {
    @Prop({ required: true, unique: true })
    user_id: string;

    @Prop({ default: 0 })
    btc: number;

    @Prop({ default: 0 })
    eth: number;

    @Prop({ default: 0 })
    xrp: number;

    @Prop({ default: 0 })
    doge: number;

    @Prop({ default: 0 })
    usdt: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
