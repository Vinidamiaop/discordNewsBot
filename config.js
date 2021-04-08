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
    "Globo",
    "Exame.com",
    "Canaltech.com.br",
    "Cnnbrasil.com.br",
    "Tecmundo.com.br",
    "Tecnoblog.net",
  ],
};

module.exports = { config, clientConfig };
