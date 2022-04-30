const fs = jest.genMockFromModule('fs')

const _fs = jest.requireActual('fs')

Object.assign(fs, _fs)

const readFileMocks = {}

fs.setReadFileMock = (path, error, data) => {
    readFileMocks[path] = [error, data]
}

fs.readFile = (path, options ,callback) => {
    if (!callback) {
        callback = options
    }
    if(path in readFileMocks) {
        callback(...readFileMocks[path])
    } else {
        _fs.readFile(path, options, callback)
    }
}

const writeMocks = {}

fs.setWriteFileMock = (path, fn) => {
    writeMocks[path] = fn
}

fs.writeFile = (path, data, options, callback) => {
    if (path in writeMocks) {
        writeMocks[path](path, data, options, callback)
    } else {
       _fs.writeFile(path, data, options, callback)
    }
}



// const path = require('path')

// let mockFiles = Object.create(null)
// function __setMockFiles(newMockFiles) {
//     mockFiles = Object.create(null)
//     for(const file in newMockFiles) {
//         const dir = path.dirname(file)
//         if(!mockFiles[dir]){
//             mockFiles[dir] = []
//         }
//         mockFiles[dir].push(path.basename(file))
//     }
// }
//
// function readdirSync(directoryPath) {
//     return mockFiles[directoryPath] || []
// }
//
// fs.__setMockFiles = __setMockFiles
// fs.readdirSync = readdirSync

module.exports = fs