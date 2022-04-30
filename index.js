const home = process.env.HOME || require('os').homedir()
const p = require('path')
const dbPath = p.join(home, '.todo')
const db = require('./db')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
    const list = await db.read(dbPath)
    list.push({
        name: title,
        done: false
    })
    await db.write(dbPath, list)
}

module.exports.clear = async () => {
    await db.write(dbPath,'')
}

module.exports.showAll = async () => {
    const list = await db.read(dbPath)
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'index',
        message: '请选择你想要操作的任务',
        choices: [{name: '退出', value: '-1'}, ...list.map((item, index) => {
            return {name: `[${item.done ? 'x' : '_' }] ${index+1}_${item.name}`, value: index}
        }), {name: '+ 创建新任务', value: "-2"}]
    })
    const index = parseInt(answer.index)
    if (index >= 0) {
        const {action} = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: '请选择操作',
            choices: [
                {name: '退出', value: 'quit'},
                {name: '已完成', value: 'maskAsDone'},
                {name: '未完成', value: 'maskAsUndone'},
                {name: '改标题', value: 'updateName'},
                {name: '删除', value: 'remove'},
            ]
        });
        switch (action) {
            case 'quit':
                break;
            case 'maskAsDone':
                list[index].done = true
                await db.write(dbPath, list)
                break;
            case 'maskAsUndone':
                list[index].done = false
                await db.write(dbPath, list)
                break;
            case 'updateName':
                const {name} = await inquirer.prompt({
                    type: 'input',
                    name: 'name',
                    message: '请输入要新的名称',
                    default: list[index].name
                })
                list[index].name = name
                await db.write(dbPath, list)
                break;
            case 'remove':
                list.splice(index, 1)
                await db.write(dbPath, list)
                break;
        }
    } else if (index === -2) {
        const {name} = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: '请输入新任务',
        });
        list.push({name, done: false});
        await db.write(dbPath, list);
    }
}