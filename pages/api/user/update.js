import jwt from "jsonwebtoken";
import {connectDB} from "../../../utils/db";
import r from 'rethinkdb'
import crypto from "crypto";

export default async (req, res) => {
    if (req.method !== 'PATCH') return res.status(405).json({
        error: 'method must be PATCH'
    })

    if (!req.headers.authorization) return res.status(401).json({error: 'No token provided'})
    if (!req.headers.authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Invalid token'})

    let decoded

    try {
        decoded = jwt.verify(req.headers.authorization.slice('Bearer '.length), process.env.JWT_KEY)
    } catch (e) {
        return res.json({
            error: 'Invalid Token'
        })
    }

    if (!decoded.id) {
        return res.json({error: 'Invalid token'})
    }

    const b = req.body

    const db = await connectDB()

    const u = await r.table('users').get(decoded.id).run(db)

    let toUpdate = {}

    if (b.avatar) {
        toUpdate.avatar = b.avatar
    }

    if (b.username) {
        toUpdate.username = b.username
    }

    if (b.email) {
        toUpdate.email = b.email
    }

    if (b.password && b.newPassword) {
        const password = crypto.createHash('md5').update(u.salt + req.body.password).digest('base64')

        if (password !== u.password) {
            return res.json({
                error: 'Invalid password'
            })
        }


        const salt = crypto.randomBytes(128).toString('hex')

        toUpdate.salt = salt

        toUpdate.password = crypto.createHash('md5').update(salt + req.body.password).digest('base64')
    }


    await r.table('users').get(decoded.id).update(toUpdate).run(db)

    res.json({success: true})
}
