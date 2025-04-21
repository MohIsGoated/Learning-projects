const axios = require('axios')
require('dotenv').config()
const readline = require('readline')
const chalk = require('chalk')
async function goat(){
    let apikey = process.env.WEATHER_API_KEY
    let url = 'https://api.weatherapi.com/v1/current.json'
    while (true) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        let input = await new Promise(resolve => {
            rl.question('', resolve)
        })
        rl.close()
        if (input === '?') {
            console.log(chalk.cyan('This is a cli weather app that uses https://www.weatherapi.com/\nto use it, enter a city name, Decimal degree, US, UK, or a canada zip code\nyou may also look up an ip by typing `auto:(ip here)`\ncurrent commands:\nclear: clears the entire output\n?: shows this screen,\nexit: exits the app'))
        } else {
            if (input === 'clear') {
                readline.cursorTo(process.stdout, 0, 0)
                readline.clearScreenDown(process.stdout)
            } else {
                if (input === 'exit') {
                    console.log(chalk.red('truly, thank you for using my cli app, all love ❤️'))
                    rl.close()
                    break
                } else {
                    let weather = await axios.get(url, {
                        validateStatus: function (status) {
                            return status == 200
                        },
                        params: {
                            'key': apikey,
                            'q': input,
                        }
                    }).catch(function (error) {
                        console.error(chalk.bgRedBright(error.response.data.error.message))
                    })
                    if (weather) {
                        const data = weather.data
                        console.log(chalk.blue(`showing weather for city ${data.location.name} located in ${data.location.country}`))
                        console.log(chalk.green(`it is currently ${data.current.temp_c}C`))
                        console.log(chalk.cyan(`currently, ${data.current.condition.text} weather can be seen`))
                        console.log(chalk.blueBright(`the wind speed is ${data.current.wind_kph}km/h, with a degree of ${data.current.wind_degree}°`))
                    }
                }
            }
        }
    }
}
if (process.env.WEATHER_API_KEY) {
    console.log(chalk.green('welcome to my cli weather app! use ? for help.'))
    goat()
} else {
    console.warn(chalk.redBright('please set your api key value in the .env file'))
}