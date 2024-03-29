import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Article } from 'src/articles/schemas/article.schema';
import { User } from 'src/users/schemas/user.schema';

export type VerificationDocument = HydratedDocument<Verification>;

@Schema({ timestamps: true })
export class Verification {
    @Prop()
    personalIdImage: string[];

    @Prop()
    latedImage: string[];

    @Prop()
    contract: string[];

    @Prop()
    video: string[];

    @Prop()
    status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Article.name })
    articleId: mongoose.Schema.Types.ObjectId

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
export const VerificationSchema = SchemaFactory.createForClass(Verification);
