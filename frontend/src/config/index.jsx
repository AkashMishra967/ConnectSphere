const {default: axios} = require("axios");



export const BASE_URL = "https://connectsphere-5-zk95.onrender.com"

const clientServer = axios.create({
  baseURL: BASE_URL,
})

export default clientServer;