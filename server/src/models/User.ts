import { Schema, model } from 'mongoose';

const UserSchema : Schema = new Schema({
    username : {
        type : String,
        unique : true,
        trim : true,
        required : true,
        minlength: 3, 
        maxlength: 30
    },
    email : {
        type : String,
        unique : true,
        trim : true,
        required : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    status: { 
        type: String,
        enum: ['online', 'offline'],
        default: 'offline' 
    },
    profile_picture: { 
        type: String 
    },
    last_login_at: { 
        type: Date 
    },
    contacts : {
        type : [Schema.Types.ObjectId],
        ref : 'User'
    }
});

UserSchema.set('timestamps', true)


export const User = model("Users",UserSchema);
