import { Schema, model } from 'mongoose';

const MessageSchema : Schema = new Schema({
    chat_room_id : {
        type : Schema.Types.ObjectId,
        ref : 'ChatRooms',
        required : true
    },
    sender_id : {
        type : Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    receiver_id : {
        type : Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    content : {
        type : String,
        required : true
    },
    is_read : {
        type : Boolean,
        default : false
    }
});

MessageSchema.set('timestamps', true);

export const Message = model("Messages",MessageSchema);