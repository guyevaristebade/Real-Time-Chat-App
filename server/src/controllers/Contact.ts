import { response } from 'express';
import { Contact, User } from '../models';
import { IUser, ResponseType } from '../types';
import mongoose, { ObjectId } from 'mongoose';

export const addContact = async (sender_user_id : string, receiver_user_id : string) : Promise<ResponseType> => {
    let responsePayload : ResponseType = {
        status : 200,
        success : true,
    }

    // condition qui vérifie la validité des id avec mongoose
    if(!mongoose.isValidObjectId(sender_user_id) && !mongoose.isValidObjectId(receiver_user_id)){
        responsePayload.status = 400
        responsePayload.success = false
        responsePayload.msg = 'Invalid user id'
        return responsePayload
    }

    try {
        // condition qui vérifie si current user n'a pas encore fait de demande à contact_user_id
        const searchContact = await Contact.findOne({ sender_user_id : sender_user_id, receiver_user_id, status : 'pending' });
        if(searchContact){
            responsePayload.status = 400;
            responsePayload.success = false;
            responsePayload.msg = 'Contact request already sent';
            return responsePayload;
        }

        // chercher l'utilisateur courant 
        const user = await User.findById(sender_user_id);
        if (!user) {
            responsePayload.status = 404;
            responsePayload.success = false;
            responsePayload.msg = 'User not found';
            return responsePayload;
        }

        // création d'une demande de contact 
        const contact = new Contact({
            sender_user_id : sender_user_id,
            receiver_user_id
        });

        await contact.save();

        responsePayload.msg = 'Contact added successfully'

    } catch (error : unknown) {
        responsePayload.status = 500
        responsePayload.success = false
        responsePayload.msg = 'Internal server error'
    }

    return responsePayload
}

// Controleur pour lister les demande de contact en attente
export const getPendingContacts = async (current_user_id : string) : Promise<ResponseType> => {
    let responsePayload : ResponseType = {
        status : 200,
        success : true,
    }

    // condition qui vérifie la validité des id avec mongoose
    if(!mongoose.isValidObjectId(current_user_id)){
        responsePayload.status = 400
        responsePayload.success = false
        responsePayload.msg = 'Invalid user id'
        return responsePayload
    }

    try {
        // chercher les demandes de contact en attente
        const contacts = await Contact.find({
            user_id : current_user_id,
            status : 'pending'
        }).populate('contact_user_id');

        responsePayload.data = contacts
    } catch (error : unknown) {
        responsePayload.status = 500
        responsePayload.success = false
        responsePayload.msg = 'Internal server error'
    }

    return responsePayload;
}

// controleur qui permet d'accepter une demande de contact
// l'utilisateur courant accepte une demande de contact
// on ajoute l'utilisateur courant dans la liste des contacts de l'utilisateur qui a envoyé la demande

export const acceptContact = async (receiver_user_id: string, sender_user_id: string): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        status: 200,
        success: true,
    };

    // 1. Vérification des IDs utilisateurs
    if (!mongoose.isValidObjectId(receiver_user_id) || !mongoose.isValidObjectId(sender_user_id)) {
        return {
            status: 400,
            success: false,
            msg: 'Invalid user ID(s)',
        };
    }

    try {
        // 2. Récupérer l'utilisateur qui reçoit la demande et celui qui l'a envoyée
        const receiver : IUser | null = await User.findById(receiver_user_id);
        const sender : IUser | null  = await User.findById(sender_user_id);

        if (!receiver || !sender) {
            return {
                status: 404,
                success: false,
                msg: 'One or both users not found',
            };
        }

        // 3. Trouver et mettre à jour la demande de contact
        const contactRequest = await Contact.findOneAndUpdate(
            { sender_user_id : sender_user_id, receiver_user_id, status: 'pending' },
            { status: 'accepted' }
        );

        if (!contactRequest) {
            return {
                status: 404,
                success: false,
                msg: 'Contact request not found',
            };
        }

        // 4. Ajouter chaque utilisateur à la liste des contacts de l'autre
        receiver.contacts.push(sender_user_id);
        sender.contacts.push(receiver_user_id);

        await receiver.save();
        await sender.save();

        responsePayload.msg = 'Contact accepted successfully';
    } catch (error: unknown) {
        // 5. Gestion des erreurs
        responsePayload.status = 500;
        responsePayload.success = false;
        responsePayload.msg = 'Internal server error';
    }

    return responsePayload;
};


// controleur qui récupère la liste des contacts de l'utilisateur courant
export const getContacts = async (id : string) : Promise<ResponseType> => {
    let responsePayload : ResponseType = {
        status : 200,
        success : true,
    }

    // condition qui vérifie la validité des id avec mongoose
    if(!mongoose.isValidObjectId(id)){
        responsePayload.status = 400
        responsePayload.success = false
        responsePayload.msg = 'Invalid user id'
        return responsePayload
    }

    try {
        // chercher l'utilisateur courant 
        const user = await User.findById(id);
        if (!user) {
            responsePayload.status = 404;
            responsePayload.success = false;
            responsePayload.msg = 'User not found';
            return responsePayload;
        }

        // chercher la liste des contacts de l'utilisateur courant
        const contacts = await Contact.find({
            user_id : id,
            status : 'accepted'
        }).populate('contact_user_id');

        responsePayload.data = contacts
    } catch (error : unknown) {
        responsePayload.status = 500
        responsePayload.success = false
        responsePayload.msg = 'Internal server error'
    }

    return responsePayload;
}

// Controleur qui permet de bloquer un contact
export const blockedContact = async () : Promise<ResponseType> =>{
    
    let responsePayload = {
        status : 200,
        success : true
    };

    try {
        
    } catch ( error : unknown) {
        
    }


    return responsePayload;
}