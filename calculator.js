// a shitty, probably broken calculator, just a learning thing
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
function safeEval(expr) {
    // Only allow numbers, +, -, *, /, %, parentheses, decimal points, and spaces.
    expr = expr.replace(/\^/g, '**')
    if (/^[\d+\-*/%.() ]+$/.test(expr) &&
        !/([+\-/%^]{2,})/.test(expr) &&      // No consecutive operators
        !/^[+\-*/%^]/.test(expr) &&          // No operator at the start
        !/[+\-*/%^]$/.test(expr)) {
        try {
            return eval(expr);
        } catch (e) {
            return "Invalid expression";
        }
    } else {
        return "Invalid expression";
    }
}
async function math() {
    while (true) {
        const x = await new Promise(resolve=> {
            rl.question('enter your equation\n', resolve)
        });
                readline.cursorTo(process.stdout, 0, 0);
                readline.clearScreenDown(process.stdout);
                const result = safeEval(x)
                if (isNaN(result)) {
                    console.log('incorrect form, please only enter correct math expressions')
                } else {
                    if (result == 'Infinity') {
                        console.log('cannot divide by zero')
                    } else {
                        console.log('result: ' + result)
                    }
                }
    }
}
math();
