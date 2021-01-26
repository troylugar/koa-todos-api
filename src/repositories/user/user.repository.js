const UserModel = require('../../models/user');

function toModel(entity) {
  return entity
    ? UserModel({
      id: entity._id,
      username: entity.username,
      password: entity.password,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt
    })
    : undefined;
}

function userRepositoryWrapper({ schema }) {
  async function findById(id) {
    const result = await schema.findById(id);
    return toModel(result);
  }

  async function findByUsername(username) {
    const result = await schema.findOne({ username });
    return toModel(result);
  }

  async function findByIdAndUpdate(id, update) {
    const result = await schema.findByIdAndUpdate(id, update);
    return toModel(result);
  }

  async function findByUsernameAndUpdate(username, update) {
    const result = await schema.findOneAndUpdate({ username }, update);
    return toModel(result);
  }

  async function insert(model) {
    const entity = new schema(model);
    const result = await entity.save();
    return toModel(result);
  }

  async function findByIdAndDelete(id) {
    const result = await schema.findByIdAndDelete(id);
    return toModel(result);
  }

  async function findByUsernameAndDelete(username) {
    const result = await schema.findOneAndDelete({ username });
    return toModel(result);
  }

  return {
    findById,
    findByUsername,
    findByIdAndUpdate,
    findByUsernameAndUpdate,
    insert,
    findByIdAndDelete,
    findByUsernameAndDelete
  };
}

module.exports = userRepositoryWrapper;
