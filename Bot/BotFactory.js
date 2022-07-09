const botLibs = new Map([
  ['NodeTelegramBotApi', './NodeTelegramBotApi/NodeTelegramBotApi']
]);

class BotFactory {
  constructor(lib) {
    if (!botLibs.has(lib)) {
      throw 'This lib does not support';
    }

    this.lib = lib;
  }

  init(token) {
    return new (require(botLibs.get(this.lib))) (token);
  }
}

module.exports = BotFactory;