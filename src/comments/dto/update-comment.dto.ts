import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto, CreateReplyDto } from './create-comment.dto';
import { IsMongoId, IsNotEmpty, IsUUID } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
export class UpdateReplyDto {
  @IsNotEmpty()
  @IsUUID()
  reply_id: string;

  @IsNotEmpty()
  content: string;
}
