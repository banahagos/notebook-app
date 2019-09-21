const express = require('express')
const router = express.Router()
const Note = require('../models/note')


// GET show a form to ADD A NOTE
router.get('/new', (req, res, next) => {
  res.render('notes/new')
})

// POST send data from form to this route to ADD A NOTE
router.post('/', (req, res, next) => {
  const { title, text } = req.body
  const newNote = new Note({ title, text, owner: req.user })
  newNote.save()
    .then(() => {
      res.redirect('/dashboard')
    })
    .catch(() => {
      console.log("something when wrong with adding a note", err)
      res.redirect('/note/new')
    })
})

// POST delete (only by owner)
router.post('/:id/delete', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      // Validation failed: don't update & redirect to dashboard
      if (!note.owner.equals(req.user._id)) {
        res.redirect('/dashboard')
      } else {
        // Valdation passed: update & redirect to dashboard
        Note.findByIdAndRemove({ _id: req.params.id })
          .then(() => {
            res.redirect('/dashboard')
          })
      }
    })
    .catch(err => next(err))
})

// GET show a form to edit a note
router.get('/:id/edit', (req, res, next) => {
  Note.findById({ _id: req.params.id })
    .then(note => {
      res.render('notes/edit', { note: note })
    })
    .catch(err => next(err))
})

// POST send the data from the form to this route to UPDATE THE NOTE (by owner only)
router.post('/:id', (req, res, next) => {
  const { title, text } = req.body
  // check if the current user is the onwer of the note
  Note.findById(req.params.id)
    .then(note => {
      // Validation failed: don't update & redirect to dashboard
      if (!note.owner.equals(req.user._id)) {
        res.redirect('/dashboard')
      } else {
        // Valdation passed: update & redirect to dashboard
        Note.updateOne({ _id: req.params.id }, { $set: { title, text, owner: req.user } })
          .then(() => {
            res.redirect('/dashboard')
          })

      }
    })
    .catch(err => next(err))
})




module.exports = router;