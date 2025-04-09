import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import config from "../../config";
import { userServices } from "./user.services";

const JWT_SECRET = config.jwt_secret as string

const registerUser = async (req: Request, res: Response): Promise<void> => {
    const {email, password, role} = req.body

    try {
        const existingUser = await userServices.findUserByEmail(email)

        if(existingUser)
        {
            res.status(409).send({message: "User email is already exist! Try a different email"})
            return
        }

        const userRole = role || "User"

        const user = await userServices.createUser(email, password, role)
        res.status(200).send({message: "User successfully created", user})
        return 
    } catch (err: any) {
        res.status(500).send({message: "User registration was unsuccessful", err})
    }
}

const loginUser = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body

    try {
        const user = await userServices.findUserByEmail(email)

        if(!user)
        {
            res.status(400).send({message: "Invalid email or password"})
            return
        }

        const isPasswordValid = await userServices.validatePassword(password, user?.password)

        if(!isPasswordValid){
            res.status(400).send({message: "Invalid Password"})
            return
        }

        const token = jwt.sign({email: user?.email, role: user?.role}, JWT_SECRET, {expiresIn: '1h'})

        res.status(200).send({message: "User logged in successfully", token})
    } catch (err: any) {
        res.status(500).send({message: "Something went wrong", err})
    }
}

export const UserController = {registerUser, loginUser}