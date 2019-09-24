const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const Tag = require('../models/tag')


// GET show a form to ADD A NOTE
router.get('/new', (req, res, next) => {
  res.render('notes/new')
})

// POST ADD A NOTE & TAGs + update relationships
router.post('/', (req, res, next) => {
  const { title, text, tags } = req.body
  // create the note
  const newNote = new Note({ title, text, owner: req.user })
  newNote.save()
    .then(newNote => {
      const arrayTags = tags.split(",") // create an array of tags
      // check if tag exists --> create / update tag --> update documents relationships between note/tags
      arrayTags.forEach(tag => {
        return Tag.findOne({ name: tag }).then(tagObj => {
          if (tagObj === null) {
            const newTag = new Tag({ name: tag, notes: newNote._id })
            return newTag.save().then(newTag => {
              return Note.updateOne({ _id: newNote._id }, { $push: { tags: newTag._id } })
            })
          } else {
            return Tag.updateOne({ _id: tagObj._id }, { $push: { notes: newNote._id } }).then(() => {
              return Note.updateOne({ _id: newNote._id }, { $push: { tags: tagObj._id } })
            })
          }
        })
      })
    })
    .then(
      res.redirect('/dashboard')
    )
    .catch(err => {
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
    .populate('tags')
    .then(note => {
      res.render('notes/edit', { note: note })
    })
    .catch(err => next(err))
})

// POST send the data from the form to this route to UPDATE THE NOTE (by owner only)
router.post('/:id', (req, res, next) => {
  const { title, text, tags } = req.body
  // check if the current user is the onwer of the note
  Note.findById(req.params.id)
    .then(note => {
      // Validation failed
      if (!note.owner.equals(req.user._id)) {
        res.redirect('/dashboard')
      } else {
        // Valdation passed
      }
      // update tags and gather tag._id's in an array
      const tagIds = []
      const arrayTags = tags.split(",") // create an array of entered tags
      arrayTags.forEach(tag => {
        Tag.findOne({ name: tag }).then(tagObj => {
          // case: tag does not exist yet --> create tag --> update tags & notes ref
          if (tagObj === null) {
            const newTag = new Tag({ name: tag, notes: req.params.id })
            return newTag.save().then(newTag => {
              tagIds.push(newTag._id)
            })
          } else {
            // case: tag does exists 
            tagIds.push(tagObj._id)
            return Tag.updateOne({ _id: tagObj._id }, { $push: { notes: req.params.id } })
              // filter unique note refs, update tag with the filtered list in order to remove duplicate refs
              .then(() => {
                console.log(tagObj)
                // how to I find the id "req.params.id" in the "tagObj" Tag
              })
              .then(uniqueList => {
                return Tag.updateOne({ _id: tagObj._id }, { $push: { notes: uniqueList } })
              })
          }
        })
          .then(() => {
            Note.updateOne({ _id: req.params.id }, { $set: { title, text, owner: req.user, tags: tagIds } })
              .then(() => {
                res.redirect('/dashboard')
              })
          })

      })
    })
})






module.exports = router;