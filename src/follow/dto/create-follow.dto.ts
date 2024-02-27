import { IsNotEmpty } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty()
  follower_id: string;
}
