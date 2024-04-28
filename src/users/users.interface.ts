import { ObjectId } from 'mongoose';

export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
    phone?: string;
    followers?: {
        _id: string;
        fullName: string;
        avatar: string;
    }[];
    followings?: {
        _id: string;
        fullName: string;
        avatar: string;
    }[];
    role?: {
        _id: string;
        name: string;
    };
    permissions?: {
        _id: string;
        name: string;
        apiPath: string;
        module: string;
    }[];
}
