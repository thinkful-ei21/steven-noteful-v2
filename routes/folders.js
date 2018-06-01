'use strict';

const express = require('express');
const foldersRouter = express.Router();
const knex = require('../knex');

// GET all folders
foldersRouter.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .orderBy('folders.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

// GET folder by id
foldersRouter.get('/:id', (req, res, next) => {

	const id = req.params.id;
	knex.select('id', 'name')
		.from('folders')
		.where('id', id)
		.then(folder => {
			res.json(folder);
		})
		.catch(err => {
			next(err);
		});
});

foldersRouter.put('/:id', (req, res, next) => {
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

	knex('folders')
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

foldersRouter.post('/', (req, res, next) => {
	const newObj = {name: req.body.name};
	
	if (!newObj.name) {
	    const err = new Error('Missing `title` in request body');
	    err.status = 400;
	    return next(err);
  	}

  	knex('folders')
  		.insert(newObj)
  		.then(folder => {
  			if(folder) {
  				res.location(`http://${req.headers.host}/folders/${folder.id}`).status(201).json(folder);
  			}
  		})
  		.catch(err => {
  			next(err);
  		});
});

foldersRouter.delete('/:id', (req, res, next) => {
	const id = req.params.id;

	knex('folders')
		.where('id', id)
		.del()
		.then(() => {
			res.sendStatus(204);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = foldersRouter;