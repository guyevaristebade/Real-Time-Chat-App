import bcrypt from "bcryptjs";
import { IUser, IUserLogin, IUserRegister, ResponseType } from "../types";
import { User } from "../models";
import { sanitizeFilter } from "mongoose";
import { passwordValidators } from "../utils";

export const createUser = async (userData : IUserRegister): Promise<ResponseType> => {
    let response: ResponseType = {
        success : true
    }

    const { username, email, password } = userData;

    if(!username || !email || !password){
        response.status = 400
        response.success = false
        response.msg = 'Veuillez remplir tous les champs';
        return response;
    }

    try {
        let user = await User.findOne(sanitizeFilter({ username, email }));
        if (user) {
            response.status = 400
            response.success = false
            response.msg = 'Un utilisateur existe déjà avec ce nom';
            return response;
        }

        let validation = passwordValidators(password);
        for (const el of validation) {
            if (!el.validator) {
                response.status = 400
                response.success = false
                response.msg = el.message
                return response
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAgent = new User(sanitizeFilter({
            username,
            email,
            password: hashedPassword,
        }));

        await newAgent.save();

        const { password: _, ...rest } = newAgent.toObject();

        response.msg = "Inscription réussie avec succès";
        response.data = rest

    } catch (e : any) {
        response.status = 500
        response.success = false;
        response.msg = e.message
    }
    return  response;
};

export const loginUser = async (userData : IUserLogin): Promise<ResponseType> => {
    let response: ResponseType = {
        success : true,
        status: 200
    }

    const { email_or_username, password } = userData;

    if(!email_or_username || !password){
        response.status = 400
        response.success = false
        response.msg = 'Veuillez remplir tous les champs';
        return response;
    }

    try {
        let user = await User.findOne(sanitizeFilter({ 
            $or : [{email : email_or_username}, {username : email_or_username}]
        })).select("-__v -updatedAt -createdAt");


        if (!user) {
            response.status = 400
            response.success = false
            response.msg = 'Aucun utilisateur trouvé avec ce nom';
            return response;
        }

        const isMatch = await bcrypt.compare(password, user?.password as string);
        if (!isMatch) {
            response.status = 400
            response.success = false
            response.msg = 'Mot de passe incorrect';
            return response;
        }

        user.status = 'online';
        user.last_login_at = new Date();
        await user.save();

        const { password: _, ...rest } = user.toObject();
        
        response.msg = "Connexion réussie";
        response.data = rest

    } catch (e : any) {
        response.status = 500
        response.success = false;
        response.msg = e.message + " une erreur s'est produite"
    }
    return  response;
}

export const logoutUser = async (userId : string): Promise<ResponseType> => {
    let response: ResponseType = {
        success : true,
        status: 200
    }

    try {
        let user = await User.findById(userId);
        if (!user) {
            response.status = 400
            response.success = false
            response.msg = 'Aucun utilisateur trouvé';
            return response;
        }
        user.status = 'offline';
        await user.save();
        response.msg = "Déconnexion réussie";

    } catch (e : any) {
        response.status = 500
        response.success = false;
        response.msg = e.message
    }
    return  response;
}

