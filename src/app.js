
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import InvertedIndex from './inverted-index';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const app = express();

if (NODE_ENV === 'PROD') {
  app.set('PORT', process.env.PORT_PROD);
} else if (NODE_ENV === 'DEV') {
  app.set('PORT', process.env.PORT_DEV);
} else {
  app.set('PORT', process.env.PORT_TEST);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let invertedIndex;
let index;

app.post('/api/create', (req, res) => {
  const body = req.body;
  const fileName = Object.keys(body).pop();
  const fileContent = Object.values(body).pop();
  invertedIndex = new InvertedIndex();
  index = invertedIndex.createIndex(fileName, fileContent);
  res.json(index);
});

app.post('/api/search', (req, res) => {
  const body = req.body;
  const fileName = Object.keys(body).pop();
  const searchTerms = Object.values(body).pop();
  const searchResult = invertedIndex.searchIndex(index, fileName, searchTerms);
  res.json(searchResult);
});

const port = app.get('PORT');
app.listen(port, () => console.log(`listening on port ${port}`));

