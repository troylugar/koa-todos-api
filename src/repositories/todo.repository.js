const Todo = require('../models/todo');

class TodoRepository {
  constructor(schema) {
    this.schema = schema;
  }

  async find() {
    const result = await this.schema.find();
    return result.map(toModel);
  }

  async findById(id) {
    const result = await this.schema.findById(id);
    return toModel(result);
  }

  async findByIdAndUpdate(id, update) {
    const result = await this.schema.findByIdAndUpdate(id, update);
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
}

function toModel(entity) {
  return entity
    ? new Todo({
      id: entity._id,
      title: entity.title,
      completed: entity.completed,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt
    })
    : undefined;
}

module.exports = TodoRepository;