const express = require('express')
const router = express.Router()

const User = require('../models/user')

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const { email, username, password } = req.body

  if (username === '' || password === '' || email === '') {
    res.render('auth/signup', { message: 'Please enter email, username and password' })
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The email already exists' })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({
        email,
        username,
        password: hashPass
      })

      newUser.save(err => {
        if (err) {
          res.render('auth/signup', { message: 'Something went wrong' })
        } else {
          res.redirect('/')
        }
      })
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router