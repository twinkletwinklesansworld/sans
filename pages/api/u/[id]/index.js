import {connectDB} from "../../../../utils/db";
import r from 'rethinkdb'

export default async (req, res) => {
    const db = await connectDB()
    const u = await r.table('users').get(req.query.id).without('password').without('salt').run(db)
    const followers = []
    const following = []
    if (!u) {
        return res.status(401).json({error: 'Invalid user'})
    } else {
        const roles = await (await r.table('roles').run(db)).toArray()

        const follows = await (await r.table('follows').run(db)).toArray()

        follows.forEach(follow => {
            if (follow.target === u.id) {
                followers.push(follow.from)
            } else if (follow.from === u.id) {
                following.push(u.id)
            }
        })

        const roleList = []

        u.roles.forEach(role => {
            if (roles.find(r => r.id === role)) {
                roleList.push(roles.find(r => r.id === role))
            }
        })

        return res.status(200).json({
            ...u,
            roles: roleList,
            followers, following
        })
    }
}
