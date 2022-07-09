const vars = require('../functions/varTypes');

class registerUser {
  static instance = null;

  db = new (require('../DAL/DAL'))();

  constructor() {
    if (registerUser.instance) {
      return registerUser.instance;
    }

    registerUser.instance = this;
  }

  async validObject(func, input) {
    if (!input) {
      throw 'Object is undefined';
    }

    if (func === 'registerState') {
      if (!input.user_id) {
        throw '"user_id" param is missed';
      }

      let user_id_type = await vars.getType(input.user_id);
      if (user_id_type !== 'number') {
        throw '"user_id" param should be Number';
      }

      return true;
    } else if (func === 'createUser') {
      if (!input.user_id) {
        throw '"user_id" param is missed';
      }

      let user_id_type = await vars.getType(input.user_id);
      if (user_id_type !== 'number') {
        throw '"user_id" param should be Number';
      }

      return true;
    } else if (func === 'addFIO') {
      if (!input.user_id) {
        throw '"user_id" param is missed';
      }

      let user_id_type = await vars.getType(input.user_id);
      if (user_id_type !== 'number') {
        throw '"user_id" param should be Number';
      }

      let user_fio_type = await vars.getType(input.user_fio);
      if (user_fio_type !== 'string') {
        throw '"user_fio" param should be String';
      }

      return true;
    } else if (func === 'addEmail') {
      if (!input.user_id) {
        throw '"user_id" param is missed';
      }

      let user_id_type = await vars.getType(input.user_id);
      if (user_id_type !== 'number') {
        throw '"user_id" param should be Number';
      }

      let user_email_type = await vars.getType(input.user_email);
      if (user_email_type !== 'string') {
        throw '"user_email" param should be String';
      }

      return true;
    }
  }

  async registerState(params) {
    await this.validObject('registerState', params);
  }

  async createUser(params) {
    await this.validObject('createUser', params);

    let user = await this.db.users.findUserByTgId(params.user_id);
    if (user) {
      return user;
    }

    let newUser = await this.db.users.addUser(params.user_id);
    return {_id: newUser.insertedId};
  }

  async addFIO(params) {
    await this.validObject('addFIO', params);

    // Регистрируем пользователя
    let user = await this.createUser(params);

    // Проверяем, что через пробел у нас ровно 3 подстроки: фамилия, имя и отчество
    let fio_parts = params.user_fio.split(' ');
    if (fio_parts.length !== 3) {
      return 'INVALID FIO';
    }

    let updateObject = {
      surname: fio_parts[0],
      name: fio_parts[1],
      patronymic: fio_parts[2]
    };

    await this.db.users.updateUser(user._id, {"fio": updateObject});

    return 'SUCCESS';
  }

  async addEmail(params) {
    await this.validObject('addEmail', params);

    let user = await this.db.users.findUserByTgId(params.user_id);
    if (!user) {
      return 'USER NOT FOUND';
    }

    // Проверка на существование почты
    let found = await this.db.users.findUserByEmail(params.user_email);
    if (found) {
      return 'EMAIL EXISTS';
    }

    await this.db.users.updateUser(user._id, {"email": params.user_email});

    return 'SUCCESS';
  }
}

module.exports = registerUser;