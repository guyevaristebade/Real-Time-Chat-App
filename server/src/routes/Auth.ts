import express, {Router, Request, Response} from 'express'
import { createUser, loginUser, logoutUser } from "../controllers";
import { AuthenticatedRequest, IUser, IUserLogin, IUserRegister, ResponseType } from "../types";
import { authenticated } from "../middlewares";
import jwt from "jsonwebtoken";
import { getCookieOptions } from "../utils";

const useSecureAuth : boolean = process.env.NODE_ENV !== 'development';

export const AuthRouter : Router = express.Router();


AuthRouter.post('/register', async (req : Request, res: Response) => {
    const userData : IUserRegister = req.body;
    const response: ResponseType = await createUser(userData)
    res.send(response);
})

AuthRouter.post('/login', async (req: Request, res: Response) => {
    const userData : IUserLogin = req.body;
    const response : ResponseType = await loginUser(userData);

    if(response.success) {
        const user : IUser = response.data;
        const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
            expiresIn: '30d'
        });

        res.cookie('chat-app-token', token, getCookieOptions(useSecureAuth));
    }
    
    return res.status(response.status as number).send(response);
});

AuthRouter.get('/is-logged-in', authenticated, async (req, res) => {

    const user = (req as AuthenticatedRequest).user?.user;

    return res.status(200).send({
        success: true,
        data: {
            user 
        }
    });
});

AuthRouter.delete('/logout', authenticated, async (req: Request, res: Response) => {
    res.cookie('chat-app-token', '', {
        maxAge: -100,
    })

    const user_id: string = (req as AuthenticatedRequest).user?.user._id as string;
    const response : ResponseType = await logoutUser(user_id);
    return res.status(response.status as number).send(response);
})
