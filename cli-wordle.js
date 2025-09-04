// worldle CLI app

import readline from 'readline'
import chalk from 'chalk'
import getword from "./utils/getword.js"
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
console.log("Start guessing!")
let running = true
let attempts = 0
let guesses = []
let word = await getword()
async function wordle() {
    let freq = {}
    for (const letter of word) {
        freq[letter] = (freq[letter] || 0) + 1
    }
    return new Promise((resolve, reject) => {
        rl.question("", (guess) => {
            word = word.toLowerCase()
            guess = guess.toLowerCase()
            if (guess.length !== 5) {
                console.log("Guess is not 5 letters long")
                run()
                return
            }
            if (guess === word) {
                console.log(chalk.green(guess))
                console.log("You Won!")
                rl.close()
            } else {
                guess = guess.split("")
                for (let i = 0; i < guess.length; i++) {
                    if (guess[i] === word[i]) {
                        guess[i] = chalk.green(guess[i]);
                        freq[guess[i]]--
                    } else if (word.includes(guess[i]) && freq[guess[i]] > 0) {
                        guess[i] = chalk.yellowBright(guess[i]);
                        freq[guess[i]]--
                    }
                }
                attempts++
                guess = guess.join("")
                guesses.push(guess)
                let pastGuesses = guesses
                    .map((guess) => guess.split("").join(""))
                    .join("\n")
                readline.cursorTo(process.stdout, 0, 0)
                readline.clearScreenDown(process.stdout)
                console.log(pastGuesses)
                if (attempts > 4) {
                    console.log(`You lost, word was ${word}`)
                    rl.close()
                } else {
                    run()
                }
            }
        })
    })

}
async function run() {
    while (running) {
        await wordle()
    }
}
run()

