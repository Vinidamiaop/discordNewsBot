const { config, clientConfig } = require("./config.js");
const dbQuery = require("./database.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class DataRequest {
  constructor() {
    this.url = `https://newsapi.org/v2/top-headlines?country=${config.country}&category=${config.category}&apiKey=${clientConfig.newsToken}`;
    this.db = new dbQuery();
  }

  // Gets data from api
  async getData(url) {
    try {
      const response = await fetch(url);
      const res = await response.json();
      return this.compareSources(res);
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

  async insertDb() {
    try {
      const data = await this.getData(this.url);
      console.log("inserting new data");

      for (let item of data) {
        let obj = {
          source: item.source.name,
          title: item.title,
          description: item.description,
          url: item.url,
          urltoimage: item.urlToImage,
          publishedat: item.publishedAt,
          shared: false,
        };

        this.db.insertValues(obj);
      }
    } catch (err) {
      throw err;
    }
  }

  // Verify if its new
  async sendNews() {
    try {
      const data = await this.db.getUnsharedNews();
      return data[data.length - 1];
    } catch (err) {
      throw err;
    }
  }

  // Embed and send the message to channel
  async embed(channel) {
    try {
      const res = await this.sendNews();
      if (res) {
        const embed = new MessageEmbed()
          .setTitle(res.title)
          .setURL(res.url)
          .setColor(0xef271b)
          .setDescription(res.description)
          .setImage(res.urltoimage)
          .setFooter(res.source);
        channel.send(embed);
        this.db.updateShared(res.id, true);
      } else {
        console.log(
          `${new Date().toLocaleDateString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })} | Nothing New`
        );
      }
    } catch (err) {
      throw err;
    }
  }

  init() {
    this.insertDb();
    setInterval(() => {
      this.insertDb();
    }, 1000 * 60 * 60);
  }
}

module.exports = DataRequest;
