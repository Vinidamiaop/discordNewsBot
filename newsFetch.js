const { config, clientConfig } = require("./config.js");
const fetch = require("node-fetch");
const fs = require("fs");

const url = `https://newsapi.org/v2/top-headlines?country=${config.country}&category=${config.category}&apiKey=${clientConfig.newsToken}`;

// Gets data from api
async function getData() {
  try {
    const response = await fetch(url);
    const res = await response.json();
    if (res.status === "ok") {
      let article;
      clientConfig.sources.forEach((item) => {
        article = res.articles.filter((el) => {
          return el.source.name === item;
        });
      });

      return article;
    }
  } catch (err) {
    console.error("Something went wrong.", err);
    return false;
  }
}

// Verify if its new
async function sendNews() {
  const data = await getData().then((res) => res);
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

module.exports = sendNews;
