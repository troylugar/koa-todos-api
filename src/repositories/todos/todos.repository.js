const TodoModel = require('../../models/todo');

function toModel(entity) {
  return entity
    ? TodoModel({
      id: entity._id,
      title: entity.title,
      completed: entity.completed,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt
    })
    : undefined;
}

function todosDbWrapper({ schema }) {
  async function find() {
    const result = await schema.find();
    return result.map(toModel);
  }

  async function findById(id) {
    const result = await schema.findById(id);
    return toModel(result);
  }

  async function findByIdAndUpdate(id, update) {
    const result = await schema.findByIdAndUpdate(id, update);
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

  return {
    find,
    findById,
    findByIdAndUpdate,
    findByIdAndDelete,
    insert
  };
}

module.exports = todosDbWrapper;