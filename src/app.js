
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import iIndex from './inverted-index';

const InvertedIndex = new iIndex.InvertedIndex();
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

app.post('/api/create', (req, res) => {
  invertedIndex = new InvertedIndex();
  const index = invertedIndex.createIndex(JSON.parse(req.body.book));
  res.json(index);
});

app.post('/api/search', (req, res) => {
  const searchTerms = req.body.searchTerms;
  const tokens = invertedIndex.searchIndex(searchTerms);
  res.json(tokens);
});

const port = app.get('PORT');
app.listen(port, () => console.log(`listening on port ${port}`));

