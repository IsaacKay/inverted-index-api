
import dotEnv from 'dotenv';
import express from 'express';
import serverSetup from '../server-setup';
import router from './routes/router';

dotEnv.config();
const app = express();
serverSetup.setPort(app);
// get port
app.use(router);
const port = app.get('PORT');
const server = app.listen(process.env.PORT || port);

export default server;

