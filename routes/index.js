const express = require('express')
const router = express.Router()
const ensureLogin = require('connect-ensure-login')
const Note = require('../models/note')


// GET home page - unlogged 
router.get('/', (req, res, next) => {
  // if the user is logged, show dashboard
  if (req.user) {
    // Find all notes from the current user
    Note.find({ owner: req.user })
      .then(notesList => {
        res.render('dashboard', { user: req.user, notesList: notesList })
      })
  }
  // if user is not logged in, show home page for unlogged users
  else {
    res.render('index')
  }
})

// GET home page - logged
router.get('/dashboard', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  // Find all notes from the current user
  Note.find({ owner: req.user })
    .populate('tags')
    .then(notesList => {
      res.render('dashboard', { user: req.user, notesList: notesList })
    })
})


module.exports = router
