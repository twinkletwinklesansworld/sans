import jwt from "jsonwebtoken";
import {connectDB} from "../../../utils/db";
import r from 'rethinkdb'

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

    let toUpdate = {}

    if (b.avatar) {
        toUpdate.avatar = b.avatar
    }

    const db = await connectDB()

    await r.table('users').get(decoded.id).update(toUpdate).run(db)

    res.json({success: true})
}
