import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Article, ArticleDocument } from 'src/articles/schemas/article.schema';
import mongoose from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: SoftDeleteModel<CommentDocument>,
    @InjectModel(Article.name)
    private articleModel: SoftDeleteModel<ArticleDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: IUser) {
    const { articleId } = createCommentDto;
    const isExistArticle = await this.articleModel.findOne({ _id: articleId });
    if (!isExistArticle) {
      throw new BadRequestException(`The article was not exists`);
    }
    const comment = await this.commentModel.create({
      ...createCommentDto,
      createdBy: user._id,
    });
    return comment;
  }

  findAll() {
    return `This action returns all comments`;
  }

  async findAllByArticleId(articleId: string) {
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      throw new BadRequestException('Can not found the article');
    }
    const comments = await this.commentModel.find({ articleId }).populate({
      path: 'createdBy',
      select: { fullName: 1, avatar: 1 },
    });
    return comments;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(_id: string, updateCommentDto: UpdateCommentDto, user: IUser) {
    const { articleId } = updateCommentDto;
    const isExistArticle = await this.articleModel.findOne({ _id: articleId });
    if (!isExistArticle) {
      throw new BadRequestException(`The article was not exists`);
    }
    return await this.commentModel.updateOne(
      { _id },
      {
        ...updateCommentDto,
        updatedBy: user._id,
      },
    );
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Not found comment');
    }
    await this.commentModel.updateOne({ _id }, { deletedBy: user._id });
    return this.commentModel.softDelete({ _id });
  }
}
