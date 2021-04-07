const { config, clientConfig } = require("./config.js");
const fetch = require("node-fetch");

const url = `https://newsapi.org/v2/top-headlines?country=${config.country}&category=${config.category}&apiKey=${clientConfig.newsToken}`;

// Função para pegar os dados da api
async function puxaDados() {
  try {
    const response = await fetch(url);
    const res = await response.json();
    return res;
  } catch (err) {
    console.error("Something went wrong.", err);
    return false;
  }
}

// função para enviar os dados para o canal
async function sendNews(token, config, client) {
  const discordChannel = client.channels.cache.find(
    (channel) => channel.name === clientConfig.channel
  );

  const data = await puxaDados(token).then((res) => res);

  if (!data) {
    discordChannel.send(`erro`);
    return;
  }

  if (data.status === "ok") {
    if (data.articles[0].title != config.oldTitle) {
      config.oldTitle = data.articles[0].title;
      discordChannel.send(`${data.articles[0].url}}`);
    } else {
      return;
    }
  }
}

module.exports = sendNews;
