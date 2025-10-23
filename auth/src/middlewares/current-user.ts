import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    id: string
    email: string
}

// this is the way to tap into expressjs builtin types and extend it
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}


// This middleware mainly to convert jwt token to json object and use it and application, otherwise every
// route or microservices has to to this verify logic.
// so, whoever uses this middleware,any routes, any microservice, they will have user info available to use 
// on req.currentUser property.
const currentUser = (req: Request, res: Response, next: NextFunction) => {
    // if jwt token not there, just move on to execute the request
    if (!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    } catch (error) {
        // if an exception occurs, just move on to execute the request , don't throw any error;
        // next(); the below next() only is enough
    }

    next();
}

export {
    currentUser
}