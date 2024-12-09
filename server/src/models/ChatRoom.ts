import { Schema, model } from 'mongoose';

const ChatRoomSchema : Schema = new Schema({
    members : {
        type : [Schema.Types.ObjectId],
        ref : 'Users',
        required : true
    },
    last_message : {
        type : Schema.Types.ObjectId,
        ref : 'Messages'
    },
    un_read_messages_count : {
        type : Number,
        default : 0
    }
});

ChatRoomSchema.set('timestamps', true);

export const ChatRoom = model("ChatRooms",ChatRoomSchema);