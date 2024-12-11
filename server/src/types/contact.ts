import { ObjectId } from "mongoose"

export type ContactStatus = 'pending' | 'accepted' | 'blocked'

export interface IContact {
    user_id: ObjectId,
    contact_user_id: ObjectId,
    status?: ContactStatus
}

export type ContactId = {
    contact_id : ObjectId
}

