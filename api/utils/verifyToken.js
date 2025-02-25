import jwt from "jsonwebtoken";
import {createError} from "../utils/error.js";

export const verifyToken = (req, res, next) =>{
    // We take the access_token from the cookies to verify the identity
    const token = req.cookies.access_token;
    // If our identity is not an admin, throw the error that says "You are not authenticated"
    if(!token) return next(createError(401, "You are not authenticated!"))
    jwt.verify(token, process.env.JWT, (err, user) => {

        // If our identity is not an admin, throw the error that says "You are not authenticated"
        if(err) return next(createError(403, "Token is not valid"))

        req.user = user;
        next();
    })
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        //Condition 1: Check if the id taken from the cookie is the same with the id taken from the parameters of request
        //Condition 2: Check if you are the admin or not (the information also taken from cookie)
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            return next(createError(403, "You are not authorized!"))
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res,next, () => {
        if(req.user.isAdmin) {
            next()
        } else {
            return next(createError(403, "You are not authorized!"))
        }
    })
}