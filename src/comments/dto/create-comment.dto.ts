import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  articleId: string;
}
export class CreateReplyDto {
  @IsNotEmpty()
  replyId: string;

  @IsNotEmpty()
  content: string;
}
