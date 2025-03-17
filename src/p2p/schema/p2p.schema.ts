import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'p2ps', timestamps: true })
export class P2p extends Document {
    @Prop({ required: true })
    wallet_id: string;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true, min: 0 })
    amount: number;

    @Prop({ required: true, min: 0 })
    price: number;
}

export const P2pSchema = SchemaFactory.createForClass(P2p);
