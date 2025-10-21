import express from "express";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { currentUserRouter } from "./routes/current-user";

const app = express()
app.use(express.json())
app.use(express.urlencoded())

app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(currentUserRouter)

app.listen(3000, () => {
    console.log('auth service running on 3000')
})