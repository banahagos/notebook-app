const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const app = require('../app')

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  })
})


passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, next) => {
  // Match user
  User.findOne({ email }, (err, user) => {
    if (err) {
      return next(err)
    }
    // No match
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: 'Incorrect email or password' })
    }
    // Match
    return next(null, user)
  })
}))