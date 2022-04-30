const program = require('commander')
const api = require('./index')

program.option('-x, --xxx','test directive')

program.command('add').description('add a task').action((...args)=> {
    api.add(args.slice(0,-1).join(' '))
})

program.command('clear').description('clear task').action(()=> {
    api.clear()
})

program.parse(process.argv)

if (process.argv.length === 2) {
   api.showAll()
}