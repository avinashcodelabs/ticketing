import { Schema, model } from "mongoose";
import { Password } from "../services/password";

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre("save", async function (done) {
    if (this.isModified('password')) {
        const hashed = Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    done()
})

const User = model("User", userSchema);

export {
    User
}