const axios = require("axios")
module.exports = {
    async getBalance(wallet) {
        const res = await axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${wallet}/balance`)
            .catch(e => {
                return e
            })

    }
}