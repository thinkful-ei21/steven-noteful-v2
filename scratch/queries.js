'use strict';

const knexDatabase = require('../knex');
knexDatabase
  .select('notes.id', 'title'/*, 'content'*/)
  .from('notes')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('notes.id')
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error('I am here ' + err);
  });

knexDatabase
  .select('id', 'title', 'content')
  .from('notes')
  .where({'id': 2})
  .then(result => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(err => {
    console.error(err);
  });