class InvitedUsersCollection {
  static instance = null;

  constructor(db) {
    if (InvitedUsersCollection.instance) {
      return InvitedUsersCollection.instance;
    }

    InvitedUsersCollection.instance = this;

    this.db = db;
    this.collection = this.db.collection('invitedUsers');
  }

  async insertInvitedUser(object) {
    return (await this.collection.insertOne(object));
  }

  async findInvitedUsersByCodeId(code_id) {
    return (await this.collection.find({code_id: code_id})).toArray();
  }

  async findInvitedUsersByTelegramId(telegram_id) {
    return (await this.collection.find({user_id: telegram_id})).toArray();
  }
}

module.exports = InvitedUsersCollection;