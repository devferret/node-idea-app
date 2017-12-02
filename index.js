const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()

// Import routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Map global promise
mongoose.Promise = global.Promise
// Connect to mongoose
mongoose
  .connect('mongodb://localhost/idea-pop', {
    useMongoClient: true
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

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
app.use('/ideas', ideas)
app.use('/users', users)

// Port works !
const port = process.env.port || 5555
app.listen(port, () => console.log(`Server started on port ${port}`))
