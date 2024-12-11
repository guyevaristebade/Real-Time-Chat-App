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