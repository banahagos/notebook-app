const express = require('express')
const router = express.Router()
const ensureLogin = require('connect-ensure-login')
const Note = require('../models/note')


// GET home page - unlogged 
router.get('/', (req, res, next) => {
  if (req.user) {
    Note.find({ owner: req.user })
      .populate('tags')
      .sort([['updated_at', -1]])
      .then(notesList => {
        res.render('index/home-logged', { user: req.user, notesList: notesList })
      })
  }
  else {
    res.render('index/home-unlogged')
  }
})

// GET home page - logged
router.get('/home', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  // Find all notes from the current user
  Note.find({ owner: req.user })
    .populate('tags')
    .sort([['updated_at', -1]])
    .then(notesList => {
      notesList.forEach((n) => {
        n.updated_at_iso = n.updated_at.toISOString()
      })
      res.render('index/home-logged', { user: req.user, notesList: notesList })
    })
})


module.exports = router
