import r from "rethinkdb";

export async function connectDB() {
    return r.connect({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        db: process.env.DB
    })
}
