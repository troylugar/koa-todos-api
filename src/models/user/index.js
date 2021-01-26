const userModelWrapper = require('./user.model');
const now = require('../../utilities/generate-date');
const uuid = require('../../utilities/generate-uuid');
const validators = require('../../validators');

const UserModel = userModelWrapper({ uuid, now, validators });
module.exports = UserModel;
