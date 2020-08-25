import r from 'rethinkdb'
import {connectDB} from "./db";

export async function validateSignup(data) {
    if (!data) return {error: 'Body must be specified'}
    if (!data.id) return {error: '\'id\' 가 비어있습니다.'}
    if (typeof data.id !== 'string') return {error: '\`id\` must be string'}
    if (data.id === '') return {error: '\'id\' id는 비어있습니다.'}
    if (!data.password) return {error: '\'password\' 가 비어있습니다.'}
    if (typeof data.password !== 'string') return {error: '\`password\` must be string'}
    if (data.password === '') return {error: '\'password\' 가 비어있습니다'}
    const conn = await connectDB()

    if (await r.db(process.env.DB).table('users').get(data.id).run(conn)) {
        return {
            error: '해당 id를 이미 사용중입니다.'
        }
    }
}

export async function validateLogin(data) {
    if (!data) return {error: 'Body must be specified'}
    if (!data.id) return {error: '\'id\' 가 비어있습니다.'}
    if (data.id === '') return {error: '\'id\' id는 비어있습니다.'}
    if (!data.password) return {error: '\'password\' 가 비어있습니다.'}
    if (data.password === '') return {error: '\'password\' 가 비어있습니다'}
}
