const { config, clientConfig } = require("./config.js");
const sendNews = require("./newsFetch.js");
const Discord = require("discord.js");

const client = new Discord.Client();

client.login(clientConfig.TOKEN);
client.once("ready", () => {
  console.log("Ready");

  setInterval(() => {
    sendNews(clientConfig.newsToken, config, client);
  }, 1000 * 60 * 15);
});
