const { config, clientConfig } = require("./config.js");
const sendNews = require("./newsFetch.js");
const Discord = require("discord.js");
const currentTime = require("./date.js");

const client = new Discord.Client();

client.login(clientConfig.TOKEN);
client.once("ready", () => {
  const discordChannel = client.channels.cache.find(
    (channel) => channel.name === clientConfig.channel
  );

  console.log("Ready");

  setInterval(() => {
    sendNews(clientConfig.newsToken, config).then((res) => {
      if (res) {
        discordChannel.send(res);
      } else {
        console.log(`${currentTime()} | Nothing New`);
      }
    });
  }, 1000 * 60 * 15);
});
