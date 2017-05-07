
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs';
import InvertedIndex from './inverted-index';
import JSONProcessor from './json-processor';

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
const uploadPath = `${process.cwd()}/dist/uploads`;

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(upload.array('files', 5));

const invertedIndex = new InvertedIndex();
let index;

app.post('/api/create', (req, res) => {
  try {
    const isReqJSON = req.headers['content-type'].indexOf('application/json');
    const isReqMultipart = req.headers['content-type'].indexOf('multipart/form-data');
    if (isReqJSON > -1) {
      const body = req.body;
      // goto json-processor.js file to see how this class works
      index = JSONProcessor.processRaw(body, invertedIndex);
      return res.send(index);
    } else if (isReqMultipart > -1) {
      const files = req.files;
      // goto json-processor.js file to see how this class works
      index = JSONProcessor.processFiles(files, invertedIndex);
      return res.send(index);
    }
  } catch (error) {
    return res.send('invalid json file');
  }
});

app.post('/api/search', (req, res) => {
  try {
    const body = req.body;
    let searchResult;
    if (!index) {
      return res.send('Please create an index. See documentation');
    }
    if (Array.isArray(body)) {
      searchResult = invertedIndex.searchIndex(index, undefined, body);
      return res.send(searchResult);
    }
    const fileName = Object.keys(body).pop();
    const searchTerms = Object.values(body).pop();
    searchResult = invertedIndex.searchIndex(index, fileName, searchTerms);
    return res.send(searchResult);
  } catch (error) {
    return res.send('Invalid javascript object');
  }
});

const port = app.get('PORT');
app.listen(port, () => console.log(`listening on port ${port}`));

export default app;

