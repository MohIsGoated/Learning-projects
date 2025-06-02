const axios = require("axios")
const {config, configDotenv} = require("dotenv");

require('dotenv').config({ path: '../../.env' });


module.exports = {
    async getPrice(coin) {
        const options = {
            method: 'GET',
            url: `https://api.coingecko.com/api/v3/coins/${coin}`,
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': process.env.CRYPTO_API
            }
        };

        return await axios
            .request(options)
            .catch(e => {
                return e
            })
    }
}