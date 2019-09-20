const passport = require('passport')
const express = require('express')
const router = express.Router()

const User = require('../models/user')

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// GET signup
router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

// GET login
router.get('/login', (req, res, next) => {
  res.render('auth/login', { "message": req.flash("error") })
})

// POST signup
router.post('/signup', (req, res, next) => {
  const { email, username, password, password2 } = req.body

  // Validation: Check required fields
  if (username === '' || password === '' || email === '') {
    res.render('auth/signup', { message: "Please fill in all fields", email, username, password, password2 })
    return;
  }

  // Validation: Check passwords match
  if (password !== password2) {
    res.render('auth/signup', { message: "Passwords do not match", email, username, password, password2 })
    return;
  }

  // Validation: check if the email already exists
  User.findOne({ email })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', { message: "The email already exists", email, username, password, password2 })
        return
      }

      // Validation passed --> create new user
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({
        email,
        username,
        password: hashPass
      })

      newUser.save(err => {
        if (err) {
          res.render('auth/signup', { message: "Something went wrong" })
        } else {
          req.flash('success_msg', "You created an account and can now log in")
          res.redirect('/login')
        }
      })
    })
    .catch(err => {
      next(err)
    })
})

// POST login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

// GET logout
router.get('/logout', (req, res, next) => {
  req.logout()
  req.flash('success_msg', "You are logged out")
  res.redirect('/login')
})


module.exports = router