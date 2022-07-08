class InviteCodesCollection {
  static instance = null;

  constructor(db) {
    if (InviteCodesCollection.instance) {
      return InviteCodesCollection.instance;
    }

    InviteCodesCollection.instance = this;

    this.db = db;
    this.collection = this.db.collection('inviteCodes');
  }

  async insertCode(object) {
    return (await this.collection.insertOne(object));
  }

  async findCode(code) {
    return (await this.collection.findOne({code: code}));
  }
}

module.exports = InviteCodesCollection;