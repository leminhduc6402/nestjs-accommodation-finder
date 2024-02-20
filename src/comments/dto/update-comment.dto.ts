import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto, CreateReplyDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
export class UpdateReplyDto extends PartialType(CreateReplyDto) {}
