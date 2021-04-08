const { config, clientConfig } = require("./config.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const currentTime = require("./date.js");

class DataRequest {
  constructor() {
    this.url = `https://newsapi.org/v2/top-headlines?country=${config.country}&category=${config.category}&apiKey=${clientConfig.newsToken}`;
  }

  // Gets data from api
  async getData() {
    try {
      const response = await fetch(this.url);
      const res = await response.json();
      if (res.status === "ok") {
        return this.compareSources(res);
      }
    } catch (err) {
      console.error("Something went wrong.", err);
      return false;
    }
  }

  compareSources(json) {
    let article = json.articles.filter((el) => {
      for (let item of clientConfig.sources) {
        if (el.source.name === item) {
          return el;
        }
      }
    });

    return article;
  }

  // Verify if its new
  async sendNews() {
    const data = await this.getData().then((res) => res);
    let article;

    if (!data) {
      console.error("Something went wrong");
      return;
    }
    data.forEach((item) => {
      if (Date.parse(item.publishedAt) > config.lastTime) {
        config.lastTime = Date.parse(item.publishedAt);
        article = item;
      }
    });
    return article;
  }

  // Embed and send the message to channel
  embed(channel) {
    this.sendNews().then((res) => {
      if (res) {
        const embed = new MessageEmbed()
          .setTitle(res.title)
          .setURL(res.url)
          .setColor(0xef271b)
          .setDescription(res.description)
          .setImage(res.urlToImage)
          .setFooter(res.source.name);
        channel.send(embed);
      } else {
        console.log(`${currentTime()} | Nothing New`);
      }
    });
  }
}

module.exports = DataRequest;
