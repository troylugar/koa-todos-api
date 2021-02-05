const NotFoundError = require('../errors/not-found.error');
const { Todo } = require('../models');

class TodoService {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async create(data) {
    return await this.todoRepository.insert(data);
  }

  async findById(id) {
    const result = await this.todoRepository.findById(id);
    if (!result) throw new NotFoundError();
    return result;
  }

  async updateById(id, updates) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) throw new NotFoundError();
    const updatedTodo = new Todo({
      ...todo,
      ...updates
    });
    await this.todoRepository.findByIdAndUpdate(id, updatedTodo);
    return updatedTodo;
  }

  async deleteById(id) {
    const result = await this.todoRepository.findByIdAndDelete(id);
    if (!result) throw new NotFoundError();
    return result;
  }

  async list() {
    return await this.todoRepository.find();
  }
}

module.exports = TodoService;