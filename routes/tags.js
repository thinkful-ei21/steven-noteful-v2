'use strict';

const express = require('express');

const tagsRouter = express.Router();

const knex = require('../knex');

// GET all folders
tagsRouter.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('tags')
    .orderBy('tags.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

// GET folder by id
tagsRouter.get('/:id', (req, res, next) => {

	const id = req.params.id;
	knex.select('id', 'name')
		.from('tags')
		.where('id', id)
		.then(folder => {
			res.json(folder);
		})
		.catch(err => {
			next(err);
		});
});

tagsRouter.put('/:id', (req, res, next) => {
	const id = req.params.id;

	const updateObj = {};
	const updateableField = 'name';

	if(updateableField in req.body) {
		updateObj['name'] = req.body['name'];
	}

	/***** Never trust users - validate input *****/
	if (!updateObj.name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}

	knex('tags')
		.where('id', id)
		.update(updateObj)
		.then(folder => {
			if(folder) {
				res.json(folder);
			} else {
				next();
			}
		})
		.catch(err => {
		  	next(err);
		});
});

tagsRouter.post('/', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

tagsRouter.delete('/:id', (req, res, next) => {
	const id = req.params.id;

	knex('tags')
		.where('id', id)
		.del()
		.then(() => {
			res.sendStatus(204);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = tagsRouter;