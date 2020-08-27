import jwt from "jsonwebtoken";
import {connectDB} from "../../../../utils/db";
import r from 'rethinkdb'

export default async (req, res) => {
    if (req.method !== 'GET') return res.status(405).json({
        error: 'method must be GET'
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

    if (decoded.id === req.query.id) {
        return res.json({error: 'Cannot follow myself'})
    }

    const db = await connectDB()

    if (!(await r.table('users').get(req.query.id).run(db))) {
        return res.json({
            error: 'Specified user does not exists'
        })
    }

    const follow = (await (await r.table('follows').run(db)).toArray()).find(r => r.from === decoded.id && r.target === req.query.id)

    if (!follow) {
        await r.table('follows').insert({
            from: decoded.id,
            target: req.query.id
        }).run(db)
    } else {
        await r.table('follows').filter({
            from: decoded.id,
            target: req.query.id
        }).delete().run(db)
    }

    return res.json({code: 200})
}
