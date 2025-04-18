const fs = require("fs")
const readline = require("readline")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// create the tasks file if it doesn't exist
if (!fs.existsSync("tasks.json")) {
    fs.writeFileSync('tasks.json', '[]');
}

async function tdl() {
    console.log('welcome to the cli to do list!\nrun help to get started');
    while (true) {
        const a = await new Promise(resolve => {
            rl.question('', resolve);
        });
        // handle uppercases
        const x = a.toLocaleLowerCase()
        let todos = JSON.parse(fs.readFileSync('./tasks.json', "utf-8"));
        if (x === 'list') {
        todos.forEach((task) => {
            const status = task.done ? '✅' : '❌'
            console.log(`[${task.id}] ${task.title} - ${task.description} (${status})`)
        })
        }
        if (x === 'add') {
            const title = await new Promise(resolve => {
                rl.question("enter your task's title\n", resolve);
            });
            const description = await new Promise(resolve => {
                rl.question("enter your task's description\n", resolve);
            });
            let id = todos.length + 1;
        let task = {
            title: title,
            description: description,
            done: false,
            id: id
         };
            todos.push(task)
        fs.writeFileSync("./tasks.json", JSON.stringify(todos, null, 2));
            console.log(`successfully added task ${title}`);
        }
        if (x === 'delete') {
            const id = Number(await new Promise(resolve => {
                rl.question('which task do you want to delete?\n', resolve);
            }));
            if (id <= todos.length && id > 0) {
        let index = todos.findIndex(a => a.id === id);
        if (index > -1) {
            todos.splice(index, 1)
            todos.forEach((task, index) => {
                task.id = index + 1
            })
            fs.writeFileSync("./tasks.json", JSON.stringify(todos, null, 2));
            console.log(`deleted task ${id}`)
        }
            } else {
                console.log("please only enter a valid task's id")
            }
        }
        if (x === 'done') {
            let id = Number(await new Promise(resolve => {
                rl.question('what task do you want to set as done?\n', resolve);
            }));
            if (!isNaN(id)) {
                if (!(id > todos.length)) {
                    let pos = todos.map(val => val.id).indexOf(id)
                    todos[pos].done = !todos[pos].done;
                    fs.writeFileSync("./tasks.json", JSON.stringify(todos, null, 2));
                    console.log(`set status of task ${id} to ${todos[pos].done}`)
                } else {
                    console.log('please only enter an id of a task')
                }

            } else {
                console.log('that task does not exist')
            }
        }
        if (x === 'exit') {
            console.log('thank you for using my todo app!')
            rl.close()
            return
        }
        if (x === 'clear') {
            readline.cursorTo(process.stdout, 0, 0);
            readline.clearScreenDown(process.stdout);
        }
        if (x === 'help') {
            console.log("command list:\nadd: used to add a new task, will ask for 2 inputs, title and description\ndelete: used to delete an existing task, will ask for 1 input which is the task id (found in list cmd)\nlist: used to check current status of tasks\ndone: used to set a task's status to either true or false\nclear: used to clear the console\nexit: used to exit the app")
        }
        if (x !== 'help' && x !== 'clear' && x !== 'exit' && x !== 'add' && x !== 'done' && x !== 'delete' && x !== 'list') {
            console.log('invalid usage, check "help" for available commands')
        }
    }
}
tdl();