# Random learning projects! 😊
## This project contains some apps I am making for the sake of learning

# CLI Weather App 🌦️
A simple Command Line Interface weather app made in node js and [Weather App](https://www.weatherapi.com/)
## features
- Live weather info by City, ZIP (US, UK, and Canada), coordinates, or an IP
- A simple set of commands
- .env usage for better privacy
- A somewhat pretty interface using chalk@4
## Setup (how to use)
1. Clone or download the zip
2. run npm i / npm install
3. edit the .example-env file with you key and rename it to .env
4. Now run it using\
```bash
node weatherapp.js
```

## Commands 
- '?' - shows help screen
- 'clear' - clears the terminal
- 'exit' - exits the app

# 🧮 Calculator

This is a basic command-line calculator written in Node.js using the `readline` module. It allows you to input simple math expressions and returns the result. It supports:

- Addition, subtraction, multiplication, division, modulo
- Parentheses and decimals
- Power (`^`) is internally converted to `**`

It includes basic input validation to prevent invalid or dangerous expressions.

#### Example:

```bash
enter your equation
3 + 4 * (2 - 1)
result: 7
```

## Special Features:

- Prevents division by zero
- Detects invalid characters and bad expression formats
- Clears screen after each input for a clean interface

## How to Use
Simply run:
```terminaloutput
node calculator.js
```
> Note: This is a learning project and not intended to be a fully secure calculator.

# ✅ CLI To-Do List App

A simple command-line to-do list manager made in Node.js. Tasks are stored in a `tasks.json` file for persistence. You can add, delete, list, and mark tasks as done using friendly prompts.

## Features
- Add tasks with a title and description
- Delete tasks by their ID
- Mark tasks as done or undone
- View all tasks with status indicators
- Persist tasks in `tasks.json`
- Basic input validation
- `clear` command to keep the interface tidy

## Example

```bash
> add
enter your task's title
Finish project
enter your task's description
Complete the README section
successfully added task Finish project

> list
[1] Finish project - Complete the README section (❌)

> done
what task do you want to set as done?
1
set status of task 1 to true

> list
[1] Finish project - Complete the README section (✅)
```

## Commands
- `add` – Adds a new task (title + description)
- `list` – Shows all current tasks with status
- `done` – Toggles a task's completion status
- `delete` – Removes a task by ID
- `clear` – Clears the terminal
- `help` – Lists all available commands
- `exit` – Closes the app

## How to Use
```bash
node todo.js
```

> Make sure `tasks.json` is in the same directory. It will be auto-created if missing.

> This project is a learning exercise. Feedback is welcome!

---

Built with Node.js, coffee ☕, and way too many console.logs.  
Made with ❤️ for learning and fun!
