import { CookieOptions } from "express";

export const getCookieOptions = (useSecureAuth : boolean) : CookieOptions => {
    return {
        maxAge: 24 * 3600 * 1000, // 1 day
        httpOnly: true, 
        secure: useSecureAuth, 
        domain: process.env.COOKIE_DOMAIN, 
        sameSite: useSecureAuth ? 'none' :  'strict', 
    };
}
