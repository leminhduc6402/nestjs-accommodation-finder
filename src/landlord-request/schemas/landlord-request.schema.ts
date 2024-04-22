import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { landlordRequestStatusEnum } from 'src/enum/enum';
import { User } from 'src/users/schemas/user.schema';

export type LandlordRequestDocument = HydratedDocument<LandlordRequest>;

@Schema({ timestamps: true })
export class LandlordRequest {
    @Prop({ required: true })
    personalID: string;

    @Prop({ required: true })
    dayOfBirth: Date;

    @Prop()
    address: string;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    nationality: string;

    @Prop({ required: true })
    dateOfIssue: Date;

    @Prop({ required: true })
    placeOfIssue: string;

    @Prop({ required: true, enum: landlordRequestStatusEnum })
    status: string;

    @Prop()
    feedBack: string;

    @Prop()
    createdAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    createdBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    updatedAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    updatedBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    deletedBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    isDelete: boolean;

    @Prop()
    deletedAt: Date;
}

export const LandlordRequestSchema =
    SchemaFactory.createForClass(LandlordRequest);
