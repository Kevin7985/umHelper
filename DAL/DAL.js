const MongoClient = require('mongodb').MongoClient;

class DAL {
  static instance = null;

  constructor() {
    if (DAL.instance) {
      return DAL.instance;
    }

    DAL.instance = this;
    //this.connect();
  }

  async connect() {
    const mongoCLient = new MongoClient(process.env.MONGODB_LINK);
    this.client = await mongoCLient.connect();
    this.db = this.client.db('umHelper');
    await this.connectCollections();
  }

  async connectCollections() {
    this.users = new (require('./Collections/UsersCollection')) (this.db);
    this.inviteCodes = new (require('./Collections/InviteCodesCollection')) (this.db);
  }
}

module.exports = DAL;