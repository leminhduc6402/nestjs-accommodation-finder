import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray } from 'class-validator';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type FileDocument = HydratedDocument<File>;

@Schema({ timestamps: true })
export class File {
  @Prop()
  name: string;

  @Prop()
  mimeType: string;

  @Prop()
  size: number;

  @Prop()
  key: string;

  @Prop()
  path: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: mongoose.Schema.Types.ObjectId;

  //   @Prop({ type: Date })
  //   updatedAt: Date;

  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  //   updatedBy: mongoose.Schema.Types.ObjectId;

  //   @Prop({ type: Date })
  //   deletedAt: Date;

  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  //   deletedBy: mongoose.Schema.Types.ObjectId;

  //   @Prop()
  //   isDelete: boolean;
}

export const FileSchema = SchemaFactory.createForClass(File);
