
export type ContactStatus = 'pending' | 'accepted' | 'blocked'

export interface IContact{
    user_id : string,
    contact_user_id : string,
    status?: ContactStatus
}

export type ContactId = {
    contact_id : string
}

