const home = process.env.HOME || require('os').homedir()
const fs = require('fs')
const p = require('path')
const dbPath = p.join(home, '.todo')

const db = {
    read (path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (error, data) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    let taskList = data.toString() !== '' ?  JSON.parse(data.toString()) : []
                    resolve(taskList)
                }
            })
        })
    },
    write (path = dbPath, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, error => {
                if(error) {
                    console.log(error)
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    }
}
module.exports = db