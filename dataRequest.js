const { config, clientConfig } = require("./config.js");
const dbQuery = require("./database.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

const db = new dbQuery();

class DataRequest {
  constructor() {
    this.url = `https://newsapi.org/v2/top-headlines?country=${config.country}&category=${config.category}&apiKey=${clientConfig.newsToken}`;
  }

  // Gets data from api
  async getData() {
    try {
      const response = await fetch(this.url);
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
    const data = await this.getData().then((res) => res);
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
      try {
        db.insertValues(obj);
      } catch (err) {
        throw err;
      }
    }
  }

  // Verify if its new
  async sendNews() {
    const data = await db.getUnsharedNews().then((res) => res);
    return data[data.length - 1];
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
          .setImage(res.urltoimage)
          .setFooter(res.source);
        channel.send(embed);
        db.updateShared(res.id, true);
      } else {
        console.log(
          `${new Date().toLocaleDateString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })} | Nothing New`
        );
      }
    });
  }

  init() {
    this.insertDb();
    setInterval(() => {
      this.insertDb();
    }, 1000 * 60 * 60);
  }
}

const test = new DataRequest();
test.sendNews().then((res) => console.log(res.source));

module.exports = DataRequest;
