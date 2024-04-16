
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateVerificationDto {
    id: string;

    status: string;
    
    feedBack: string;
}
