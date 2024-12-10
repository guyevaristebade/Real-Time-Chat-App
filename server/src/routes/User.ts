import express, {Router, Request, Response} from 'express'
import { createUser, loginUser, logoutUser } from "../controllers";
import { ResponseType } from "../types";
import { authenticated } from "../middlewares";
import jwt from "jsonwebtoken";
import { getCookieOptions } from "../utils";

const useSecureAuth : boolean = process.env.NODE_ENV !== 'development';

export const AuthRouter : Router = express.Router();


AuthRouter.post('/register', async (req : Request, res: Response) => {
    const response: ResponseType = await createUser(req.body)
    res.send(response);
})

AuthRouter.post('/login', async (req: Request, res: Response) => {
    const response : ResponseType = await loginUser(req.body);
    if(response.success) {
        const user = response.data as any;
        const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
            expiresIn: '30d'
        });

        res.cookie('chat-app-token', token, getCookieOptions(useSecureAuth));
    }
    return res.status(response.status as number).send(response);
});

AuthRouter.get('/is-logged-in', authenticated, async (req, res) => {
    const user = (req as any).user.user;

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
    let response : ResponseType = await logoutUser((req as any).user.user._id);
    return res.status(response.status as number).send(response);
})
