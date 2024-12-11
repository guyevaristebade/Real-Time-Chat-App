import { Contact, User } from '../models';
import { IContact } from '../types/contact';
import { IUser, ResponseType } from '../types';
import mongoose from 'mongoose';

export const addContact = async (contactData : IContact) : Promise<ResponseType> => {
    let responsePayload : ResponseType = {
        status : 200,
        success : true,
    }

    // condition qui vérifie la validité des id avec mongoose
    if(!mongoose.isValidObjectId(contactData.user_id) && !mongoose.isValidObjectId(contactData.contact_user_id)){
        responsePayload.status = 400
        responsePayload.success = false
        responsePayload.msg = 'Invalid user id'
        return responsePayload
    }

    try {
        // chercher l'utilisateur courant 
        const user = await User.findById(contactData.user_id);
        if (!user) {
            responsePayload.status = 404;
            responsePayload.success = false;
            responsePayload.msg = 'User not found';
            return responsePayload;
        }

        // processus d'ajout au contact 
        const contact = new Contact(contactData);
        await contact.save()

        responsePayload.msg = 'Contact added successfully'

    } catch (error : unknown) {
        responsePayload.status = 500
        responsePayload.success = false
        responsePayload.msg = 'Internal server error'
    }

    return responsePayload
}

// controlleur qui permet d'accepter une demande de contact
// l'utilisateur courant accepte une demande de contact
// on ajoute l'utilisateur courant dans la liste des contacts de l'utilisateur qui a envoyé la demande

export const acceptContact = async (contactData : IContact) : Promise<ResponseType> => {
    let responsePayload : ResponseType = {
        status : 200,
        success : true,
    }

    // condition qui vérifie la validité des id avec mongoose
    if(!mongoose.isValidObjectId(contactData.user_id) && !mongoose.isValidObjectId(contactData.contact_user_id)){
        responsePayload.status = 400
        responsePayload.success = false
        responsePayload.msg = 'Invalid user id'
        return responsePayload
    }

    try {
        // chercher l'utilisateur courant 
        const contacted_user : IUser | null = await User.findById(contactData.contact_user_id);
        
        // on cherche l'utilisateur qui a envoyé la demande de contact, il possède l'attribut user_id
        const contact_user = await User.findById(contactData.user_id);

        if (!contacted_user || !contact_user) {
            responsePayload.status = 404;
            responsePayload.success = false;
            responsePayload.msg = 'User not found';
            return responsePayload;
        }

        // // chercher le contact
        const contact = await Contact.findOneAndUpdate({
            user_id : contactData.user_id,
            contact_user_id : contactData.contact_user_id
        },{
            status : 'accepted'
        })

        if(!contact){
            responsePayload.status = 404
            responsePayload.success = false
            responsePayload.msg = 'Contact not found'
            return responsePayload
        }

        contacted_user.contacts.push(contactData.user_id)

        responsePayload.msg = 'Contact accepted successfully'

    } catch (error : unknown) {
        responsePayload.status = 500
        responsePayload.success = false
        responsePayload.msg = 'Internal server error'
    }

    return responsePayload
}