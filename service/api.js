const axios = require('axios');

const url = axios.default.create({baseURL: "https://www.googleapis.com/youtube/v3/search?"})

module.exports = url;