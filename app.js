const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;
const songs = require('./controllers/documentsController');
const auth = require('./controllers/userController');

const app = express();
const port = 3000;
// Setup mongoose
mongoose.connect(MONGO_URL, { useNewUrlParser: true }).catch(e => {
    console.error(e.message);
  }); 

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Middlewares
app.use(cors())
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  
  
  // Enable preflight requests for all routes
  app.options('*', cors());

// Controllers
app.use('/api/documents', songs, cors());
app.use('/api/auth', auth, cors());

app.listen(port, () => {
    console.log('Starting server at port ' + port);
});