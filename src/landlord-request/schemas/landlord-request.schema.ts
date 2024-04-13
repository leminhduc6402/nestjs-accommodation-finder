import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LandlordRequestDocument = HydratedDocument<LandlordRequest>;

@Schema({ timestamps: true })
export class LandlordRequest {
    

    @Prop()
    createdAt: Date;

    @Prop()
    createdBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    updatedAt: Date;

    @Prop()
    updatedBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    deletedBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    isDelete: boolean;

    @Prop()
    deletedAt: Date;
}

export const LandlordRequestSchema =
    SchemaFactory.createForClass(LandlordRequest);
