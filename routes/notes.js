'use strict';

const express = require('express');

// Create an notesRouter instance (aka "mini-app")
const notesRouter = express.Router();

const knex = require('../knex');

// Get All (and search by query)
notesRouter.get('/', (req, res, next) => {
  const { searchTerm, folderId } = req.query;

  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folder_id', folderId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

// Get a single item
notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex.select('id', 'title', 'content')
    .from('notes')
    .where({'id': id})
    .orderBy('notes.id')
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

// Put update an item
notesRouter.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .where('id', id)
    .update({
      title: updateObj['title'],
      content: updateObj['content']
    })
    .then(note => {
      if(note) {
        res.json(note);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Post (insert) an item
notesRouter.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .insert({
      title: newItem['title'],
      content: newItem['content']
    })
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      }
    })
    .catch(err => {
      next(err);
    });
});

// Delete an item
notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where('id', id)
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = notesRouter;
