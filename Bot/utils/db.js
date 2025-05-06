const sqlite3 = require('sqlite3');
const path = require("path");


const dbpath = path.join(__dirname, '..', 'data', 'discord.db')
const db = new sqlite3.Database(dbpath)
        async function execute(db, sql, params = []) {
                if (params.length > 0) {
                        return new Promise((resolve, reject) => {
                                db.run(sql, params, (err) => {
                                        if (err) reject(err)
                                        resolve()
                                })
                        })
                }
                return new Promise((resolve, reject) => {
                        db.exec(sql, (err) => {
                                if (err) reject(err)
                                resolve()
                            })
                })
        }
        async function queryone(db, sql, params = []) {
                return new Promise((resolve, reject) => {
                        db.get(sql, params, (err, rows) => {
                                if (err) reject(err)
                                resolve(rows)
                        })
                })
        }
        async function queryall(db, sql, params = []) {
                return new Promise((resolve, reject) => {
                        db.all(sql, params, (err, row) => {
                                if (err) reject(err)
                                resolve(row)
                        })
                })
        }
execute(db, `CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER PRIMARY KEY,
    balance TEXT NOT NULL)`)
module.exports = { execute, queryall , queryone , db }