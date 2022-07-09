const strings = require('../functions/strings');

class inviteUsers {
  static instance = null;

  db = new (require('../DAL/DAL'))();

  constructor() {
    if (inviteUsers.instance) {
      return inviteUsers.instance;
    }

    inviteUsers.instance = this;
  }

  async getType(input) {
    let reqex = new RegExp(/^\[object (\S+?)\]$/);
    let matches = Object.prototype.toString.call(input).match(reqex) || [];
    return (matches[1] || 'undefined').toLowerCase();
  }

  async validObject(func, input) {
    if (!input) {
      throw 'Object is undefined';
    }

    if (func === 'generateCode') {
      if (!input.user_id) {
        throw '"user_id" param is missed';
      }

      if (!input.users_amount) {
        throw '"users_amount" param is missed';
      }

      let user_id_type = await this.getType(input.user_id);
      if (user_id_type !== 'number') {
        throw '"user_id" param should be Number';
      }

      let users_amount_type = await this.getType(input.users_amount);
      if (users_amount_type !== 'number') {
        throw '"users_amount" param should be Number';
      }

      if (input.users_amount === -1 && !input.expires) {
        throw '"expires" is required if users_amount is -1';
      }

      if (input.users_amount === -1 && input.expires) {
        let expires_type = await this.getType(input.expires);
        if (expires_type !== 'date') {
          throw '"expires" param should be Date';
        }
      }

      return true;
    }
    else if (func === 'checkUserRights') {
      if (!input.user_id) {
        throw '"user_id" param is missed';
      }

      let user_id_type = await this.getType(input.user_id);
      if (user_id_type !== 'number') {
        throw '"user_id" param should be Number';
      }

      return true;
    }
    else if (func === 'checkCode') {
      if (!input.code) {
        throw '"code" param is missed';
      }

      let code_type = await this.getType(input.code);
      if (code_type !== 'string') {
        throw '"code" param should be String';
      }
    }
    else if (func === 'useCode') {
      if (!input.user_id) {
        throw '"user_id" param is missed';
      }

      let user_id_type = await this.getType(input.user_id);
      if (user_id_type !== 'number') {
        throw '"user_id" param should be Number';
      }

      if (!input.code) {
        throw '"code" param is missed';
      }

      let code_type = await this.getType(input.code);
      if (code_type !== 'string') {
        throw '"code" param should be String';
      }
    }
    else if (func === 'disableCode') {
      if (!input.code) {
        throw '"code" param is missed';
      }

      let code_type = await this.getType(input.code);
      if (code_type !== 'string') {
        throw '"code" param should be String';
      }
    }
  }

  async checkUserRights(params) {
    await this.validObject('checkUserRights', params);

    // получаем пользователя из БД
    let user = await this.db.users.findUserByTgId(params.user_id);

    // Проверяем, есть ли у него возможность создавать пригласительные коды
    return !(!user || !user.canCreateInviteLinks);


  }

  async getCode(params) {
    await this.validObject('checkCode', params);

    return (await this.db.inviteCodes.findCode(params.code));
  }

  async disableCode(params) {
    await this.validObject('disableCode', params);
    let code = await this.getCode(params);
    if (!code) {
      return;
    }

    let users = await this.db.invitedUsers.findInvitedUsersByCodeId(code._id);

    if (code.users_amount === users.length) {
      await this.db.inviteCodes.updateCodeById(code._id, {enabled: false});
      return;
    }

    if (code.expires) {
      let now = new Date();
      if (now - code.expires > 0) {
        await this.db.inviteCodes.updateCodeById(code._id, {enabled: false});
      }
    }
  }

  async generateCode(params) {
    await this.validObject('generateCode', params);

    // проверяем полномочия человека
    let allowed = await this.checkUserRights(params);
    if (!allowed) {
      return 'THIS FUNCTION IS NOT ALLOWED FOR THIS USER';
    }

    // генерируем код, проверяем повторения
    let success = true;
    let code = null;
    while (success) {
      code = strings.generateString(50);
      success = await this.getCode({code: code});
    }

    // добавляем новый код
    params.expires = params.expires || undefined;
    params.code = code;
    params.enabled = true;
    params.createdAt = new Date();
    let res = await this.db.inviteCodes.insertCode(params);


    // отдаём его
    return code;
  }

  async useCode(params) {
    await this.validObject('useCode', params);

    // Проверяем существование кода
    let code = await this.getCode({code: params.code});
    if (!code) {
      return 'CODE NOT FOUND';
    }

    // Проверяем доступность кода
    await this.disableCode({code: params.code});
    code = await this.getCode({code: params.code});
    if (!code.enabled) {
      return 'INVALID CODE';
    }

    // Проверяем, переходил ли этот человек уже по ссылкам?
    let userInvited = await this.db.invitedUsers.findInvitedUsersByTelegramId(params.user_id);
    if (userInvited.length !== 0) {
      return 'USER ALREADY INVITED';
    }

    // Добавляем нового пользователя и "привязываем" к нему вступление по этому коду
    let object = {
      user_id: params.user_id,
      code_id: code._id,
      usedAt: new Date()
    };

    this.db.invitedUsers.insertInvitedUser(object);
    await this.disableCode({code: params.code});

    return 'SUCCESS';
  }
}

module.exports = inviteUsers;