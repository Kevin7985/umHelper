class UsersCollection {
  static instance = null;

  constructor(db) {
    if (UsersCollection.instance) {
      return UsersCollection.instance;
    }

    UsersCollection.instance = this;

    this.db = db;
    this.collection = this.db.collection('users');
  }

  async findUserByTgId(telegram_id) {
    return (await this.collection.findOne({telegram_id: telegram_id}));
  }
}

module.exports = UsersCollection;