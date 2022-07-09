const TelegramBot = require('node-telegram-bot-api');

class NodeTelegramBotApi {
  static instance = null;

  constructor(token) {
    if (NodeTelegramBotApi.instance) {
      return NodeTelegramBotApi.instance;
    }

    NodeTelegramBotApi.instance = this;

    this.bot = new TelegramBot(token, {polling: true});
  }

  async sendMessage(chat_id, text, options = {parse_mode: 'HTML'}) {
    if (!options.parse_mode) {
      options.parse_mode = 'HTML';
    }

    return (await this.bot.sendMessage(chat_id, text, options));
  }

  async listen(callback) {
    this.bot.on('text', message => {
      console.log(message);
    });
  }
}

module.exports = NodeTelegramBotApi;