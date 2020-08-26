import {validateSignup} from "../../../utils/UserUtils";
import crypto from "crypto";
import r from 'rethinkdb'
import {connectDB} from "../../../utils/db";

export default async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).json({error: 'method must be POST'})

    const err = await validateSignup(req.body)
    if (err) {
        return res.json(err)
    }

    const salt = crypto.randomBytes(128).toString('hex')

    const password = crypto.createHash('md5').update(salt + req.body.password).digest('base64')

    await r.table('users').insert({id: req.body.id, password, salt, roles: []}).run(await connectDB())

    res.json({status: 'success'})
}
