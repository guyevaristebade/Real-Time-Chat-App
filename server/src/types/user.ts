import { Document } from 'mongoose';
import { Request } from 'express';
import { Schema } from 'mongoose';

export interface IUserRegister{
    username: string;
    email: string;
    password: string
}

export interface IUserLogin{
    email_or_username: string;
    password: string;
}
export interface IUser extends Document {
    _id : string
    username: string;
    email: string;
    status : string;
    contacts : Array<String>;
    last_login_at? : Date
    password? : string
    __v? : number
}


export  interface AuthenticatedRequest extends Request {
    user?: {
        user: {
            _id: string;
        };
    };
}