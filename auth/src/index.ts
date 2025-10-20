import express from "express";

const app = express()
app.use(express.json())
app.use(express.urlencoded())


app.listen(3000, () => {
    console.log('auth service running on 3000')
})