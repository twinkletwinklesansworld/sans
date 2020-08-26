import {validateLogin} from "../../../utils/UserUtils";
import crypto from "crypto";
import r from 'rethinkdb'
import {connectDB} from "../../../utils/db";
import jwt from 'jsonwebtoken'

export default async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).json({error: 'method must be POST'})

    const err = await validateLogin(req.body)
    if (err) {
        return res.json(err)
    }

    const conn = await connectDB()


    let u = await r.table('users').get(req.body.id).run(conn)

    if (!u) {
        const searched = await (await r.table('users').filter({email: req.body.id}).run(conn)).toArray()

        u = searched[0]
        if (!u) {
            return res.json({error: '아이디나 비밀번호가 일치하지 않습니다.'})
        }
    }

    const password = crypto.createHash('md5').update(u.salt + req.body.password).digest('base64')

    if (u.password !== password) {
        return res.json({error: '아이디나 비밀번호가 일치하지 않습니다.'})
    }

    const token = jwt.sign({
        id: u.id
    }, process.env.JWT_KEY)

    res.json({token})
}
