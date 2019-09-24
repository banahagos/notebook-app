const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const Tag = require('../models/tag')


// GET show a form to ADD A NOTE
router.get('/new', (req, res, next) => {
  res.render('notes/new')
})

// POST ADD A NOTE
router.post('/', async (req, res, next) => {
  const { title, text, tags } = req.body

  const newNote = new Note({ title, text, owner: req.user })
  const addedNote = await newNote.save()
  const arrayTags = tags.split(",") 
  const promises = arrayTags.map(async tag => {
    const tagObj = await Tag.findOne({ name: tag })
    if (tagObj === null) {
      const newTag = new Tag({ name: tag })
      const addedTag = await newTag.save()
      await Note.updateOne({ _id: addedNote._id }, { $push: { tags: addedTag._id } })
    } else {
      await Note.updateOne({ _id: addedNote._id }, { $push: { tags: addedTag._id } })
    }
  })
  await Promise.all(promises)
  res.redirect('/dashboard')
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
router.post('/:id', async (req, res, next) => {
  const { title, text, tags } = req.body

  const note = await Note.findById(req.params.id)
  if (!note.owner.equals(req.user._id)) {
    res.redirect('/dashboard')
  } else {
    const tagIds = []
    const arrayTags = tags.split(",")
    const promises = arrayTags.map(async tag => {
      const tagObj = await Tag.findOne({ name: tag })
      if (tagObj === null) {
        const newTag = new Tag({ name: tag })
        const addedTag = await newTag.save()
        tagIds.push(addedTag._id)
        await Note.updateOne({ _id: req.params.id }, { $set: { title, text, owner: req.user, tags: tagIds } })
      } else {
        tagIds.push(tagObj._id)
        await Note.updateOne({ _id: req.params.id }, { $set: { title, text, owner: req.user, tags: tagIds } })
      }
    })
    await Promise.all(promises)
    res.redirect('/dashboard')
  }
})


module.exports = router;


