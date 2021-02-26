const db = require('../../data/dbConfig');

module.exports = {
  get,
  getBy,
  getById,
  add,
};

function get() {
  return db('users').orderBy('id');
}

function getBy(filter) {
  return db('users').where(filter).orderBy('id');
}

function getById(id) {
  return db('users').where({ id }).first();
}

async function add(user) {
  const [id] = await db('users').insert(user);
  return getById(id);
}
