import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string

  @Prop()
  phone: string;

  @Prop()
  role: string;

  @Prop()
  isActive: boolean  
  
  @Prop()
  address: boolean

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdBy: mongoose.Schema.Types.ObjectId

  @Prop()
  updatedBy: mongoose.Schema.Types.ObjectId
}

export const UserSchema = SchemaFactory.createForClass(User);
