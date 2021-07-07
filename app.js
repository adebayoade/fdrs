const express = require('express');
const Handlebars = require('handlebars');
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var path = require('path');
const nodemailer = require('nodemailer');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

const app = express();
app.use(express.static('public'));

// Database Connect
mongoose
  .connect('mongodb://localhost/fdrs-db')
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// Import Model
require('./models/Subcriber');
const Subscriber = mongoose.model('subscriber');

// BodyParse Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set('view engine', 'handlebars');

// Save subscribers information to the database.
app.post('/send', (req, res) => {
  const details = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
  };
  new Subscriber(details).save().then(() => {
    res.render('success', {
      msg: 'New user added.',
    });
  });
});

// Index Route
app.get('/', (req, res) => {
  res.render('home', { holla: 'Hello, World!' });
});

// Success Route
app.get('/success', (req, res) => {
  res.render('success');
});

// Users Index Page
app.get('/subscribers', async (req, res) => {
  const showPerPage = 10;
  let skipPage = 0;
  let page = 0;

  if (req.query.page) {
    page = Number(req.query.page);
    skipPage = (page - 1) * showPerPage;
  }

  try {
    const totalData = await Subscriber.find();

    const subscribers = await Subscriber.find()
      .limit(showPerPage)
      .sort({ date: 'desc' })
      .skip(skipPage);

    let nextPages = Math.ceil(totalData.length / showPerPage);
    nextPages += 1;

    const array = [];
    for (let i = 1; i < nextPages; i++) {
      array.push(i);
    }

    res.render('subscribers/index', {
      subscribers,
      totalSubscribers: array,
      page,
    });
  } catch (e) {
    console.log(e);
  }
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Admin Route
app.get('/admin', (req, res) => {
  res.render('admin');
});

// Add Route
app.get('/add', (req, res) => {
  res.render('add');
});

// Next Pages Route
app.get('/subscribers?page=:items', (req, res) => {
  // console.log(req.params.items);
  // res.redirect('subscribers');
  res.send('Ok');
});

// Start Server
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
