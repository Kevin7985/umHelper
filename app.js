const dotenv = require('dotenv').config();
const db = new (require('./DAL/DAL')) ();
const invite = new (require('./modules/inviteUsers')) ();

async function start() {
  await db.connect();
  let result = await invite.generateCode({user_id: -1, users_amount: 1});
  console.log(result);
}

start();