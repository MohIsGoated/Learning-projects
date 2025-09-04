import axios from "axios"

const url = "https://random-word-api.vercel.app/api?words=1&length=5"

export default async () => {
   const response = await axios.get(url)
    return response.data[0]
}