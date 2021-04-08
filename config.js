const dotenv = require("dotenv").config();

const config = {
  lastTime: 0,
  category: "technology",
  country: "br",
};

const clientConfig = {
  channel: "firstbot",
  TOKEN: process.env.TOKEN,
  newsToken: process.env.newsToken,
  sources: [
    "Canaltech.com.br",
    "Cnnbrasil.com.br",
    "Tecmundo.com.br",
    "Globo",
    "Tecnoblog.net",
  ],
};

module.exports = { config, clientConfig };
