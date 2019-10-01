const flash = require('connect-flash')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const ensureLogin = require('connect-ensure-login')
const hbs = require('hbs');
const bodyParser = require('body-parser')
require('dotenv').config()


// Mongoose configuration
mongoose
  .connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const session = require('express-session')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const MongoStore = require("connect-mongo")(session)


const app = express()

app.use(session({
  secret: "abc",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ // this is going to create the `sessions` collection in the db
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  })
}))

// Connect flash
app.use(flash())

// Middleware - globals variables for auth error & success messages 
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

require('./config/passport.js')
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

hbs.registerPartials(__dirname + '/views/partials')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth-routes')
const notesRouter = require('./routes/notes')
const tagsRouter = require('./routes/tags')

app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/users', ensureLogin.ensureLoggedIn(), usersRouter)
app.use('/notes', ensureLogin.ensureLoggedIn(), notesRouter)
app.use('/tags', ensureLogin.ensureLoggedIn(), tagsRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});



module.exports = app
