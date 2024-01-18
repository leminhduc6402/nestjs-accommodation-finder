import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray } from 'class-validator';
import mongoose, { Date, HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  categoryId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  acreage: number;

  @Prop()
  status: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ type: Object })
  address: {
    streetAddress: string;
    latitude: number;
    longitude: number;
    provinceCode: number;
    districtCode: number;
    wardCode: number;
    provinceName: string;
    districtName: string;
    wardName: string;
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

  @Prop()
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop()
  updatedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop()
  deletedBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  isDelete: boolean;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
