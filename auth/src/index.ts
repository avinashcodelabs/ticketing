import express from "express";
import mongoose from "mongoose";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { currentUserRouter } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
// stores the user session data in cookie at client. I am storing this at client so, not one only
// microservice(server) stores the data. so same client session data available to all microservices.
// Data consistency
import cookieSession from "cookie-session";

const app = express()

// since we proxy all requests through load-balancer/ingress nginx controller to express pod/container
// we need to tell express that, it's normal and you can trust this proxy mechanism 
app.set("trust proxy", true)

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieSession({
    // By default cookie signs(encrypts) the content it holds, we want to disable this, 
    // because whatever node.js/express algorithm uses to encrypt it could differ,
    // it when other microservices tries to read in if it's written in different framework like GO, or Java Spring.
    // Anyway JWT we store it in cookie, already tamper-resistant (encrypted)
    signed: false,
    secure: true, // send the cookie, only if it is https. on http it does'nt work

}))

app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(currentUserRouter)

// Order of middleware matters here.
// NotFoundError should come after all the valid routes and just before errorHandler,
// in order to handle the errors thrown by NotFoundError.  
app.all("/*splat", () => {      // "*" express4 and "/*splat" in express5 
    throw new NotFoundError()
})

app.use(errorHandler)

// Connect to Mongo DB before starting the app server
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined")
    }
    console.log("JWT_KEY", process.env.JWT_KEY)

    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth") // 'auth' in the end is just a DB name, I want to create.    
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error(error);
    }
    app.listen(3000, () => {
        console.log('auth service running on 3000')
    })
}

start()