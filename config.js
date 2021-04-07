const dotenv = require("dotenv").config();

const config = {
  oldTitle: "",
  category: "technology",
  country: "br",
};

const clientConfig = {
  channel: "firstbot",
  TOKEN: process.env.TOKEN,
  newsToken: process.env.newsToken,
};

module.exports = { config, clientConfig };
