import { Router, Response, Request } from 'express';
import { authenticated } from '../middlewares';
import { AuthenticatedRequest, ResponseType } from '../types';
import { searchUser } from '../controllers';

export const UserRouter : Router = Router();

UserRouter.get('/search',authenticated, async (req :Request, res : Response) =>{
    const username_or_email : string = req.query.username_or_email as string;
    

    const user_id: string = (req as AuthenticatedRequest).user?.user._id as string;
    console.log(user_id)
    const response: ResponseType = await searchUser(username_or_email, user_id);
    res.status(response.status as number).send(response)
})