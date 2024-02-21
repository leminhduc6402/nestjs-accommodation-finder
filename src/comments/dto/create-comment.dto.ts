import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  articleId: string;
}
export class CreateReplyDto {
  // @IsNotEmpty()
  // commentId: string;

  @IsNotEmpty()
  content: string;
}
