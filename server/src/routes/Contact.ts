import { Router, Request, Response } from 'express';
import { acceptContact, addContact, getPendingContacts } from '../controllers';
import { AuthenticatedRequest } from '../types';
import { authenticated } from '../middlewares';

export const ContactRouter = Router();

ContactRouter.post('/add', authenticated,async (req: Request, res: Response) => {
    const { receiver_user_id } = req.body;
    const current_user_id = (req as AuthenticatedRequest).user?.user._id as string;
    console.log()
    const response = await addContact(current_user_id,receiver_user_id);
    res.status(response.status as number).json(response);
});

ContactRouter.get('/pending', authenticated,async (req: Request, res: Response) => {
    const current_user_id = (req as AuthenticatedRequest).user?.user._id as string;
    const response = await getPendingContacts(current_user_id);
    res.status(response.status as number).json(response);
});

ContactRouter.post('/accept', authenticated,async (req: Request, res: Response) => {
    const { receiver_user_id } = req.body;
    const sender_user_id = (req as AuthenticatedRequest).user?.user._id as string;
    const response = await acceptContact(sender_user_id,receiver_user_id);
    res.status(response.status as number).json(response);
})