const db = require('../db')
const fs = require('fs')
jest.mock('fs')

describe('db', () => {
    it('can read', async () => {
        expect(db.read instanceof Function).toBeTruthy()
        const data = [{"name": "买可乐"}]
        fs.setReadFileMock('/xxx', null , JSON.stringify(data))
        expect(await db.read('/xxx')).toStrictEqual(data)
    })

    it('can write',  async () => {
        expect(db.write instanceof Function).toBeTruthy()
        let fakeFile;
        fs.setWriteFileMock('/yyy', (path, data, callback) => {
            fakeFile = data
            callback(null)
        })
        const list = 1
        await db.write('/yyy', list)
        expect(fakeFile).toBe(list)
    })
})