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
    role: { 
        type: String, 
        enum: ['user', 'admin', 'moderator'], default: 'user' 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    avatarUrl: { 
        type: String 
},
    phoneNumber: { 
        type: String 
    },
    verifiedAt: { 
        type: Date 
    },
    lastLoginAt: { 
        type: Date 
    },
});

UserSchema.set('timestamps', true)


export const User = model("User",UserSchema);
