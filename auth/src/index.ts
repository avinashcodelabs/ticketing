import express from "express";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { currentUserRouter } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express()
app.use(express.json())
app.use(express.urlencoded())

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

app.listen(3000, () => {
    console.log('auth service running on 3000')
})