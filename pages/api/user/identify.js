import {connectDB} from "../../../utils/db";
import jwt from 'jsonwebtoken'
import r from 'rethinkdb'

export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({error: 'this method is not allowed'})
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

    if (decoded) {
        const db = await connectDB()
        let u = await r.table('users').get(decoded.id).run(db)
        if (!u) {
            return res.status(401).json({error: 'Invalid token'})
        } else {
            let u = await r.table('users').get(decoded.id).without('password').without('salt').run(db)
            return res.status(200).json(u)
        }
    } else {
        return res.status(401).json({error: 'Invalid token'})
    }


}
