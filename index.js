const { config, clientConfig } = require("./config.js");
const sendNews2 = require("./newsFetch.js");
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
    sendNews2().then((res) => {
      if (res) {
        // discordChannel.send(res);
        const embed = new Discord.MessageEmbed()
          .setTitle(res.title)
          .setURL(res.url)
          .setColor(0xef271b)
          .setDescription(res.description)
          .setImage(res.urlToImage);
        discordChannel.send(embed);
      } else {
        console.log(`${currentTime()} | Nothing New`);
      }
    });
  }, 1000 * 60 * 15);
});
