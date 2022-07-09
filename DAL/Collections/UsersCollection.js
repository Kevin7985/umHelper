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

  async addUser(telegram_id) {
    return (await this.collection.insertOne({telegram_id: telegram_id}));
  }

  async updateUser(_id, updateObject) {
    return (await this.collection.updateOne({_id: _id}, {$set: updateObject}));
  }

  async findUserByEmail(email) {
    return (await this.collection.findOne({email: email}));
  }
}

module.exports = UsersCollection;