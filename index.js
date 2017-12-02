const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()

// Map global promise
mongoose.Promise = global.Promise
// Connect to mongoose
mongoose
  .connect('mongodb://localhost/idea-pop', {
    useMongoClient: true
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

// Include Idea model
require('./models/idea')
const Idea = mongoose.model('idea')

// Templetes works !
app.set('views', './views')
app.set('view engine', 'pug')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)
app.use(flash())

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// Routes works !
app.get('/', (req, res) => res.render('index'))
app.get('/about', (req, res) => res.render('about'))
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/ideas', { ideas: ideas })
    })
})
app.get('/ideas/add', (req, res) => res.render('ideas/add'))
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({ _id: req.params.id }).then(idea =>
    res.render('ideas/edit', { idea: idea })
  )
})
app.post('/ideas', bodyParser.json(), (req, res) => {
  let errors = []
  if (!req.body.title) errors.push({ text: 'Please add a title' })
  if (!req.body.details) errors.push({ text: 'Please add some details' })
  if (errors.length > 0)
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      detials: req.body.detials
    })
  else
    new Idea({
      title: req.body.title,
      details: req.body.details
    })
      .save()
      .then(() => {
        req.flash('success_msg', 'Idea saved !')
        res.redirect('/ideas')
      })
})
app.put('/ideas/:id', (req, res) =>
  Idea.findOne({ _id: req.params.id }).then(idea => {
    idea.title = req.body.title
    idea.details = req.body.details
    idea.save().then(() => {
      req.flash('success_msg', 'Idea updated !')
      res.redirect('/ideas')
    })
  })
)
app.delete('/ideas/:id', (req, res) =>
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Idea removed !')
    res.redirect('/ideas')
  })
)

// Port works !
const port = process.env.port || 5555
app.listen(port, () => console.log(`Server started on port ${port}`))
