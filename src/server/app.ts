import path from 'path';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { unknownEndpointHandler, globalErrorHandler } from './utils/middleware';
import apiRouter from './routes/api';
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

const app: Express = express();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API router
app.use('/api', apiRouter);

// catch all for FE react routes
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.use('/*', unknownEndpointHandler);
app.use(globalErrorHandler);

export default app;
