const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./loaders/mongoose');
const routes = require('./routes');
const config = require('./config');

dotenv.config();

// Node ENV
process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() === 'production'
    ? 'production'
    : 'development';

// Connect MongoDB
connectDb();

// Cors
const corsOptions = {
  origin: (origin, callback) => {
    if (
      origin === undefined ||
      origin === config.originHost ||
      origin === config.adminHost
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not Allowed Origin!'));
    }
  },
  credentials: true,
};

// Use Express
const app = express();
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app
  .listen(config.port, () => {
    console.log(`
    ################################################
            🛡️  Server listening on ${config.port}!! 🛡️
    ################################################
  `);
  })
  .on('error', err => {
    console.error(err);
  });
app.get('/', (_, res) => {
  res.send(`
  Current Port : ${config.port}
  Allow Origin : ${config.originHost}
  Node Env : ${process.env.NODE_ENV}
  `);
});
