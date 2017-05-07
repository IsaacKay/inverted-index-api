
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import InvertedIndex from './inverted-index';
import JSONProcessor from './json-processor';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const app = express();
// set port based on the  NODE_ENV  VALUE
if (NODE_ENV === 'PROD') {
  app.set('PORT', process.env.PORT_PROD);
} else if (NODE_ENV === 'DEV') {
  app.set('PORT', process.env.PORT_DEV);
} else {
  app.set('PORT', process.env.PORT_TEST);
}

// use bodyparser to get application/json request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uploadPath = `${process.cwd()}/dist/uploads`;

// set torage path for multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadPath);
  },
  // rename file to it's original name
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const upload = multer({ storage });

// use multer to get multipart/form-data requests
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
    let searchResult = {};
    if (!index) {
      // if index is not yet created, send error message
      return res.send('Please create an index. See documentation');
    }
    // the request body is an array
    if (Array.isArray(body)) {
      searchResult = invertedIndex.searchIndex(index, undefined, body);
      return res.send(searchResult);
    }
    // if this line is reached, it means a javascript object is sent
    const fileNames = Object.keys(body);
    fileNames.forEach((fileName) => {
      const searchTerms = body[fileName]; // searchTerm for one file
      const result = invertedIndex.searchIndex(index, fileName, searchTerms);
      searchResult[fileName] = result[fileName];
    });
    return res.send(searchResult);
  } catch (error) {
    return res.send('Invalid javascript object');
  }
});

// get port
const port = app.get('PORT');
app.listen(process.env.PORT || port, () => console.log(`listening on port ${port}`));

export default app;

