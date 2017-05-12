import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import requestHandler from '../helpers/request-handler';

// use bodyparser to get application/json request
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
const uploadPath = `${process.cwd()}/uploads`;
// set torage path for multer
const RequestHandler = requestHandler.RequestHandler;
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
router.use(upload.array('files', 5));
router.post('/api/create', (req, res) => {
  RequestHandler.handleCreate(req, res);
});
router.post('/api/search', (req, res) => {
  RequestHandler.handleSearch(req, res);
});
// catch all route
router.use((req, res, next) => {
  res.redirect('https://github.com/IsaacKay/inverted-index-api/tree/develop');
  next();
});


export default router;
