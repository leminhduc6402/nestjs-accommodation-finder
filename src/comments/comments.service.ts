import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';
import { UpdateCommentDto, UpdateReplyDto } from './dto/update-comment.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Article, ArticleDocument } from 'src/articles/schemas/article.schema';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongoose';

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
    const comments = await this.commentModel
      .find({ articleId })
      .sort('-createdAt')
      .populate({
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
      { new: true },
    );
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Not found comment');
    }
    await this.commentModel.updateOne({ _id }, { deletedBy: user._id });
    return this.commentModel.softDelete({ _id });
  }

  async addReply(_id: string, createReplyDto: CreateReplyDto, user: IUser) {
    const { content } = createReplyDto;
    const isExist = await this.commentModel.findById(_id);
    if (!isExist) {
      throw new NotFoundException();
    }
    const reply = {
      _id: uuidv4(),
      content,
      updatedAt: new Date(),
      updatedBy: {
        _id: new mongoose.Types.ObjectId(user._id),
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
      },
    };
    const comment = await this.commentModel.updateOne(
      { _id },
      {
        $push: {
          replies: reply,
        },
      },
    );
    return comment;
  }

  async editReply(_id: string, updateReplyDto: UpdateReplyDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Must be ObjectId type');
    }

    const comment = await this.commentModel.findById(_id);
    if (!comment) {
      throw new NotFoundException('Not found the comment');
    }
    const { content, reply_id } = updateReplyDto;
    const reply = comment.replies.find(
      (reply) => reply._id === reply_id,
    );
    if (!reply) {
      throw new NotFoundException('Reply not found');
    }
    // Cập nhật nội dung của reply
    reply.content = content;
    reply.updatedBy = {
      _id: user._id as unknown as ObjectId,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
    };

    // Lưu lại comment
    await comment.save();

    return reply;
  }

  // async removeReply(_id: string, reply_id: string) {
  //   if (!mongoose.Types.ObjectId.isValid(_id)) {
  //     throw new BadRequestException('Must be ObjectId type');
  //   }
  //   if (!mongoose.Types.ObjectId.isValid(reply_id)) {
  //     throw new BadRequestException('Must be ObjectId type');
  //   }
  //   const comment = await this.commentModel.findOneAndUpdate(
  //     { _id },
  //     { $pull: { replies: { _id: reply_id as unknown as ObjectId } } },
  //   );
  //   return comment;
  // }

  async removeReply(_id: string, reply_id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Must be ObjectId type');
    }

    return await this.commentModel.updateOne(
      { _id },
      { $pull: { replies: { _id: reply_id } } },
      { new: true },
    );
  }
}