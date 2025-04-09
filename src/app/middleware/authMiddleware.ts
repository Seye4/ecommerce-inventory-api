import jwt from 'jsonwebtoken'
import config from '../config'
import { NextFunction, Request, Response } from 'express'


const JWT_SECRET = config.jwt_secret as string

export const verifyToken = (req: Request, res: Response, nex: NextFunction) => {
    //split header to get token
    const token  =req.headers.authorization?.split(" ")[1]

    if(!token)
    {
        res.status(401).send({message: 'Invalid token, Access Denied'})
        return
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err)
        {
            res.status(401).send({message: 'Invalid token, Access Denied'})
            return
        }

        (req as any).decoded = decoded
        nex()
    })

}