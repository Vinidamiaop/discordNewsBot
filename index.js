const config = require("./config.js");
const { sendNews, TOKEN, newsToken } = require("./newsFetch.js");
const Discord = require("discord.js");

const client = new Discord.Client();

client.login(TOKEN);
client.once("ready", () => {
  console.log("Ready");

  setInterval(() => {
    sendNews(newsToken, config, client);
  }, 1000 * 60 * 15);
});
