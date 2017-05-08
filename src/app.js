
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import InvertedIndex from './inverted-index';
import Controller from './controllers/controller';

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
  Controller.createIndex(req, res);
});

app.post('/api/search', (req, res) => {
  Controller.searchIndex(req, res);
});

// get port
const port = app.get('PORT');
app.listen(process.env.PORT || port, () => console.log(`listening on port ${port}`));

export default app;

