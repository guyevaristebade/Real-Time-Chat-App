import { Document } from 'mongoose';
import { Request } from 'express';


export interface IUserRegister{
    username: string;
    email: string;
    password: string
}

export interface IUserLogin{
    email: string;
    password: string;
}
export interface IUser extends Document {
    _id : string
    username: string;
    email: string;
    status : string;
    contacts : Array<IUser>;
    last_login_at? : Date
    password? : string
}


export  interface AuthenticatedRequest extends Request {
    user?: {
        user: {
            _id: string;
        };
    };
}