import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    fullName: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    password: string;

    @Prop()
    avatar: string;

    @Prop()
    phone: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
    role: mongoose.Schema.Types.ObjectId;

    @Prop()
    active: boolean;

    @Prop({ type: Object })
    address: {
        streetAddress: string;
        latitude: number;
        longitude: number;
        provinceCode: string;
        districtCode: string;
        wardCode: string;
        provinceName: string;
        districtName: string;
        wardName: string;
    };

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
    followers: User[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
    followings: User[];

    @Prop()
    refreshToken: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    createdBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    updatedBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    deletedBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
