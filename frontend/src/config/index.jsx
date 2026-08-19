const {default: axios} = require("axios");



export const BASE_URL = "https://connectsphere-8vzz.onrender.com"

const clientServer = axios.create({
  baseURL: BASE_URL,
})

export default clientServer;