import {IncomingForm} from 'formidable'
import crypto from 'crypto'
import {promises as fs} from 'fs'
import path from 'path'

export const config = {
    api: {
        bodyParser: false
    }
}

export default async (req, res) => {
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({fields, files})
        })
    })

    const f = data.files.file

    const name = (Date.now()) + '_' + crypto.randomBytes(64).toString('hex').replace('\\', '.') + '_' + f.name

    await fs.writeFile('./public/attachments/' + name, await fs.readFile(f.path))

    res.json({url: '/attachments/' + name})
}
