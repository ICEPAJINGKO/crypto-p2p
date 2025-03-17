import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'wallets', timestamps: true })
export class Wallet extends Document {
    @Prop({ required: true, unique: true })
    user_id: string;

    @Prop({ default: 5000 })
    btc: number;

    @Prop({ default: 5000 })
    eth: number;

    @Prop({ default: 5000 })
    xrp: number;

    @Prop({ default: 5000 })
    doge: number;

    @Prop({ default: 5000 })
    usdt: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
