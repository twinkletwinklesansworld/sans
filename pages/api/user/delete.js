import jwt from "jsonwebtoken";
import r from 'rethinkdb'
import {connectDB} from "../../../utils/db";
import crypto from "crypto";

export default async (req, res) => {
    if (req.method !== 'POST') return res.json({
        error: 'Method must be POST'
    })

    if (!req.body.password) {
        return res.json({
            error: 'password not provided'
        })
    }

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

    const db = await connectDB()

    const u = await r.table('users').get(decoded.id).run(db)

    if (!u) {
        return res.json({
            error: 'User not exists'
        })
    }

    const password = crypto.createHash('md5').update(u.salt + req.body.password).digest('base64')

    if (password !== u.password) {
        return res.json({
            error: 'Invalid token/password'
        })
    }

    await r.table('users').get(u.id).delete().run(db)

    return res.json({
        code: 200
    })
}
