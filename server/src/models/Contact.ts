import { Schema, model } from 'mongoose';

const ContactSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        ref : 'Users',
        require : true
    },
    contact_user_id :{
        type : Schema.Types.ObjectId,
        ref : 'Users',
        require : true
    },
    status : {
        type : String,
        enum : ['pending','accepted','blocked'],
        default : 'pending'
    }
})

ContactSchema.set('timestamps',true);

export const Contact = model('Contacts',ContactSchema);