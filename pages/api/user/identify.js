import {connectDB} from "../../../utils/db";
import jwt from 'jsonwebtoken'
import r from 'rethinkdb'

export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({error: 'this method is not allowed'})
    }
    if (!req.headers.authorization) return res.status(401).json({error: 'No token provided'})
    if (!req.headers.authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Invalid token'})
    const decoded = jwt.verify(req.headers.authorization.slice('Bearer '.length), process.env.JWT_KEY)

    if (decoded) {
        const db = await connectDB()
        const u = await r.table('users').get(decoded.id).run(db)
        if (!u) {
            return res.status(401).json({error: 'Invalid token'})
        } else {
            return res.status(200).json({
                id: u.id,
                avatar: u.avatar || null
            })
        }
    } else {
        return res.status(401).json({error: 'Invalid token'})
    }


}