// const path = require('path');
import express, { Express } from 'express';
import { unknownEndpoint, globalErrorHandler } from './utils/middleware';

// const cors = require('cors');
// const cookieParser = require('cookie-parser');

const app: Express = express();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// TODO: define routes here

// redirect to react UI
app.get('/', (req, res) => {
  // res.sendFile(path.resolve(__dirname, '../../client/index.html'));
  res.send('testing');
});

app.use('/*', unknownEndpoint);
app.use(globalErrorHandler);

export default app;
