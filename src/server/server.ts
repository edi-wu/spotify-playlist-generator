// const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// use api, go to apirouter
// app.use('/api', apiRouter);

// redirect to react UI
// app.get('/*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../../client/index.html'));
// });

// global error handler
// app.use((err, req, res, next) => {
//   const defaultErr = {
//     log: 'Express error handler caught unknown middleware error',
//     status: 500,
//     message: { err: 'An error occurred' },
//   };
//   const errorObj = Object.assign({}, defaultErr, err);
//   console.log(errorObj.log);
//   return res.status(errorObj.status).json(errorObj.message);
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;
