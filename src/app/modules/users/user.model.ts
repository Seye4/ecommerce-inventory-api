import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    }
})

export const User = model<TUser>("User", userSchema)