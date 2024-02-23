import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray } from 'class-validator';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  // categoryId: mongoose.Schema.Types.ObjectId;
  categoryId: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  acreage: number;

  @Prop()
  status: string;

  @Prop()
  active: boolean;

  @Prop({ type: Object })
  address: {
    streetAddress: string;
    provinceCode: number;
    districtCode: number;
    wardCode: number;
    provinceName: string;
    districtName: string;
    wardName: string;
  };

  @Prop({ type: Object })
  location: {
    coordinates: number[];
    type: string;
  };

  @Prop({ required: true })
  images: string[];

  @Prop()
  verifyStatus: string;

  @Prop({ type: Date })
  expiredVerifyDate: Date;

  @Prop({ type: Date })
  expiredAt: Date;

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
export const ArticleSchema = SchemaFactory.createForClass(Article);
