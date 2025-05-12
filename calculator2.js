const readline = require("readline")
const math = require("mathjs")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function calc() {
    while (true) {
        const input = await new Promise(resolve => {
            rl.question('Enter an equation\n', resolve)
        })

        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);

        try {
            const result = math.evaluate(input);
            if (isNaN(result)) {
                console.log('cant divide by 0')
                continue
            }
            console.log(result)
        } catch (e) {
            console.log('Invalid expression:', e.message);
        }
    }
}
calc()