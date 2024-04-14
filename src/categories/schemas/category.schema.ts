import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
    @Prop()
    name: string;

    @Prop()
    active: boolean;

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    createdBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Date })
    updatedAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    updatedBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Date })
    deletedAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    deletedBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    isDelete: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
