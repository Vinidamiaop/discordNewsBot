const { config, clientConfig } = require("./config.js");
const DataRequest = require("./dataRequest.js");
const Discord = require("discord.js");

const dataRequest = new DataRequest();
dataRequest.init();
const client = new Discord.Client();

client.login(clientConfig.TOKEN);
client.once("ready", () => {
  const discordChannel = client.channels.cache.find(
    (channel) => channel.name === clientConfig.channel
  );

  console.log("Ready");

  dataRequest.embed(discordChannel);
  setInterval(() => {
    dataRequest.embed(discordChannel);
  }, 1000 * 60 * 15);
});
