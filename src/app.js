
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import bodyParser from 'body-parser';
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

if (!fs.existsSync('./dist/uploads')) {
  fs.mkdirSync('./dist/uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'dist/uploads');
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
  const isReqJSON = req.headers['content-type'].indexOf('application/json');
  const isReqMultipart = req.headers['content-type'].indexOf('multipart/form-data');
  if (isReqJSON > -1) {
    const body = req.body;
    index = JSONProcessor.process(body, invertedIndex);
  } else if (isReqMultipart > -1) {
    const files = req.files;
    let books;
    try {
      files.forEach((file) => {
        const fileType = file.mimetype.toLowerCase();
        if (fileType === 'application/json') {
          const filePath = `./dist/uploads/${file.filename}`;
          const options = { encoding: 'utf-8' };
          books = fs.readFileSync(filePath, options);
          books = books.toString();
          try {
            books = JSON.parse(books);
            index = invertedIndex.createIndex(file.filename, books);
          } catch (error) {
            throw new Error('malformed json file');
          }
        } else {
          throw new Error('invalid file: upload json file');
        }
      });
    } catch (error) {
      index = error.message;
    }
  }
  res.send(index);
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

