r.dbCreate('sans')
r.db('sans').tableCreate('users')
r.db('sans').grant('sans', {read: true, write: true})
r.db('sans').table('roles')
r.db('sans').tableCreate('posts')
r.db('sans').tableCreate('follows')
