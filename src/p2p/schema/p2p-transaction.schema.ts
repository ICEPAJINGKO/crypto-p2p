import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'p2ps_transactions', timestamps: true })
export class P2pTransaction extends Document {
    @Prop({ required: true })
    p2p_id: string;

    @Prop({ required: true, min: 0 })
    amount: number;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ required: true })
    status: string;
}

export const P2pTransactionSchema =
    SchemaFactory.createForClass(P2pTransaction);
