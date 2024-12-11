import { ResponseType } from "../types";
import {User} from "../models";


export const searchUser = async (query: string, current_user_id : string): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        status: 200,
        success: true,
    };

    try {
        //  $regex recherche selon un motif
        // $option : i , permet de dire cela est insensible à casse
        // si on recherche John on trouvera aussi john 
        const users = await User.find({
            $or: [{ username: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
            _id: { $ne: current_user_id }  // Exclus l'utilisateur courant
        }).select("-password -__v -createdAt -updatedAt");

        if (users) {
            responsePayload.data = users;
        } else {
            responsePayload.data = [];
        }

    } catch (error) {
        responsePayload.status = 500;
        responsePayload.success = false;
        responsePayload.msg = 'Internal server error';
    }

    return responsePayload;
};


// fonction qui permet à l'utilisateur courant d'ajouter un contact 
export const addContact = async (current_user_id: string, contact_id: string): Promise<ResponseType> => {
    let responsePayload: ResponseType = {
        status: 200,
        success: true,
    };

    try {
        const currentUser  = await User.findById(current_user_id);
        const contactUser = await User.findById(contact_id);

        if (!currentUser || !contactUser) {
            responsePayload.status = 404;
            responsePayload.success = false;
            responsePayload.msg = 'User not found';
            return responsePayload;
        }

        if (currentUser.contacts.includes(contact_id)) {
            responsePayload.status = 400;
            responsePayload.success = false;
            responsePayload.msg = 'Contact already added';
            return responsePayload;
        }

        currentUser.contacts.push(contact_id);
        await currentUser.save();

        responsePayload.msg = 'Contact added successfully';
        responsePayload.data = currentUser;

    } catch (error) {
        responsePayload.status = 500;
        responsePayload.success = false;
        responsePayload.msg = 'Internal server error';
    }

    return responsePayload;
};