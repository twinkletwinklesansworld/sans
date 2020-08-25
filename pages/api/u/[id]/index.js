import {connectDB} from "../../../../utils/db";
import r from 'rethinkdb'

export default async (req, res) => {
    const db = await connectDB()
    const u = await r.table('users').get(req.query.id).run(db)
    if (!u) {
        return res.status(401).json({error: 'Invalid user'})
    } else {
        const roles = await (await r.table('roles').run(db)).toArray()

        const roleList = []

        u.roles.forEach(role => {
            if (roles.find(r => r.id === role)) {
                roleList.push(roles.find(r => r.id === role))
            }
        })

        return res.status(200).json({
            id: u.id,
            avatar: u.avatar || null,
            roles: roleList
        })
    }
}
