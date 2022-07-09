const dotenv = require('dotenv').config();
const db = new (require('./DAL/DAL')) ();
const invite = new (require('./modules/inviteUsers')) ();

async function start() {
  await db.connect();
  let expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + 1);
  // let result = await invite.generateCode({user_id: -1, users_amount: -1, expires: expiresDate}); // создание нового кода
  // let result = await invite.useCode({user_id: 544075351, code: 'Zz6s8TkIbIKE66CNDG2Yd7JpeJexCTxSLNkZ5E81sCAbra8ODN'}); // использование кода
  let result = await invite.deleteCode({user_id: -1, code: 'Zz6s8TkIbIKE66CNDG2Yd7JpeJexCTxSLNkZ5E81sCAbra8ODN'}); // удаление кода
  console.log(result);
}

start();