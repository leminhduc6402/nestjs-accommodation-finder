import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';
import { User } from 'src/users/schemas/user.schema';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
    @Prop()
    name: string;

    @Prop()
    active: boolean;

    @Prop()
    type: string;

    // @Prop({
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: Category.name,
    //     required: true,
    // })
    // categoryId: mongoose.Schema.Types.ObjectId;

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

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
