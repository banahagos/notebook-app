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
router.get('/home', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  // Find all notes from the current user
  try {

    let notesList = await Note.find({ owner: req.user })
      .populate('tags')
      .populate('owner')
      .sort([['updated_at', -1]])

    notesList.forEach(n => {
      n.updated_at_iso = n.updated_at.toISOString()
    })


    res.render('index/home-logged', { user: req.user, notesList: notesList })
  }
  catch (err) {
    console.log(err)
  }
})


module.exports = router
