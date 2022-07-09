const dotenv = require('dotenv').config();
const db = new (require('./DAL/DAL')) ();
const invite = new (require('./modules/inviteUsers')) ();
const register = new (require('./modules/registerUser')) ();

async function start() {
  await db.connect();
  let expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + 1);
  //let result = await invite.generateCode({user_id: -1, users_amount: -1, expires: expiresDate}); // создание нового кода
  // let result = await invite.useCode({user_id: 544075351, code: 'VzyU5WWbrf6YRDYQg5BO69Ee2gwwRosJkpB62poXG4z9LARcZg'}); // использование кода
  // let result = await invite.deleteCode({user_id: -1, code: 'VzyU5WWbrf6YRDYQg5BO69Ee2gwwRosJkpB62poXG4z9LARcZg'}); // удаление кода
  // let result = await register.addFIO({user_id: 544075351, user_fio: 'Саркисов Илья Артемьевич'});
  let result = await register.addEmail({user_id: 544075351, user_email: 'umschoolis7985@gmail.com'});
  console.log(result);
}

start();