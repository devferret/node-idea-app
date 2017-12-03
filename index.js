const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const passport = require('passport')

const app = express()

// Import routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Import MongoDB config
const db = require('./config/database')
// Map global promise
mongoose.Promise = global.Promise
// Connect to mongoose
mongoose
  .connect(db.mongoURI, {
    useMongoClient: true
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

// Call Passport
require('./services/passport')(passport)

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
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
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
