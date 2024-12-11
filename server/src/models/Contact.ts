import { Schema, model, ObjectId } from 'mongoose';

const ContactSchema = new Schema({
    sender_user_id : {
        type : Schema.Types.ObjectId,
        ref : 'Users',
        require : true
    },
    receiver_user_id :{
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