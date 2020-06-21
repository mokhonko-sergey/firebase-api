const _ = require('lodash');
const express = require('express');
const news = express();
const { getNews, getSingleRecord, addNews, editNews, deleteNews } = require('./functions');

const { authenticate } = require('../authenticate');

news.get('/', async (req, res) => {
  let { startAt, itemsOnPage, q, hideNotVisible = true } = req.query;
  let result = await getNews({q, startAt, count: itemsOnPage, hideNotVisibile: hideNotVisible === 'false' ? false : hideNotVisible});

  const status = result.success ? 200 : 400;
  res.set('Access-Control-Allow-Origin', '*');
  res.status(status).json(result);
});

news.get("/:key", async (req, res) => {
  const key = req.params.key;
  const result = await getSingleRecord(key);
  const status = result.success ? 200 : 400;
  res.set('Access-Control-Allow-Origin', '*');
  res.status(status).json(result);
});

news.get('/category/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;

  let { startAt, itemsOnPage, q, hideNotVisible = true } = req.query;
  let result = await getNews({q, startAt, count: itemsOnPage, category: categoryId, hideNotVisibile: hideNotVisible === 'false' ? false : hideNotVisible});

  const status = result.success ? 200 : 400;
  res.set('Access-Control-Allow-Origin', '*');
  res.status(status).json(result);
});

news.post('/', async (req, res) => {
  const isLoggedIn = await authenticate(req);
  const { title, description, content, visible, category } = req.body;
  const result = isLoggedIn.authenticated 
    ? await addNews({ title, content, authorId: isLoggedIn.userID, description, visible, category }) 
    : isLoggedIn;
  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
});

news.put('/:key', async (req, res) => {
  const key = req.params.key;
  const { title, description, content, visible, category } = req.body;
  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated 
    ? await editNews(key, { title, description, content, userIdUpdate: isLoggedIn.userID, visible, category }) 
    : isLoggedIn;
  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
});

news.delete('/:key', async (req, res) => {
  const key = req.params.key;

  const isLoggedIn = await authenticate(req);
  const result = isLoggedIn.authenticated ? await deleteNews(key) : isLoggedIn;
  res.set('Access-Control-Allow-Origin', '*');
  res.json(result);
});


exports.news = news;