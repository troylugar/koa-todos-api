const UserModel = require('../models/user');

class UserRepository {
  constructor(schema) {
    this.schema = schema;
  }

  async findById(id) {
    const result = await this.schema.findById(id);
    return toModel(result);
  }

  async findByUsername(username) {
    const result = await this.schema.findOne({ username });
    return toModel(result);
  }

  async findByIdAndUpdate(id, update) {
    const result = await this.schema.findByIdAndUpdate(id, update);
    return toModel(result);
  }

  async findByUsernameAndUpdate(username, update) {
    const result = await this.schema.findOneAndUpdate({ username }, update);
    return toModel(result);
  }

  async insert(model) {
    const entity = new this.schema(model);
    const result = await entity.save();
    return toModel(result);
  }

  async findByIdAndDelete(id) {
    const result = await this.schema.findByIdAndDelete(id);
    return toModel(result);
  }

  async findByUsernameAndDelete(username) {
    const result = await this.schema.findOneAndDelete({ username });
    return toModel(result);
  }
}

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

module.exports = UserRepository;
