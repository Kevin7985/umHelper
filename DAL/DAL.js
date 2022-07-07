const MongoClient = require('mongodb').MongoClient;

class DAL {
  static instance = null;

  constructor() {
    if (DAL.instance) {
      return DAL.instance;
    }

    DAL.instance = this;

    this.dbConnect();
  }

  async dbConnect() {
    const mongoCLient = new MongoClient(process.env.MONGODB_LINK);
    this.client = await mongoCLient.connect();
    this.db = this.client.db('umHelper');
  }
}

module.exports = DAL;