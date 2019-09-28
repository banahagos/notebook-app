const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const Tag = require('../models/tag')
const uploadCloud = require('../config/cloudinary.js');
const vision = require('@google-cloud/vision')


// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'APIKey.json'
});

// GET dashboard
router.get('/', (req, res, next) => {
  res.redirect('/dashboard')
})

// GET show a form to ADD A NOTE
router.get('/new', (req, res, next) => {
  res.render('notes/new')
})

// POST ADD A NOTE
router.post('/', async (req, res, next) => {
  try {
    const { title, text, tags } = req.body
    let arrayTags = tags.split(",")
    let newNote = new Note({ title, text, owner: req.user })
    let addedNote = await newNote.save()
    if (tags !== "") {
      arrayTags.map(async tag => {
        let tagObj = await Tag.findOne({ name: tag })
        if (tagObj === null) {
          let newTag = new Tag({ name: tag })
          let addedTag = await newTag.save()
          await Note.updateOne({ _id: addedNote._id }, { $push: { tags: addedTag._id } })
        } else {
          await Note.updateOne({ _id: addedNote._id }, { $push: { tags: tagObj._id } })
        }
      })
    }
    res.redirect('/dashboard')
  }
  catch (err) {
    console.log('something went wrong with adding a note')
    res.render('notes/new')
  }
})

// GET show a form to Upload handwritten note
router.get('/upload', (req, res, next) => {
  res.render('notes/upload')
})

// POST upload handwritten note + text dectection
router.post('/upload', uploadCloud.single('image'), async (req, res, next) => {

  const imgPath = req.file.url;
  const imgName = req.file.originalname;

  // text detection
  try {
    const [result] = await client.documentTextDetection(imgPath)
    const fullTextAnnotation = result.fullTextAnnotation

    let newNote = new Note({ title: req.body.title, text: fullTextAnnotation.text, owner: req.user, imgPath, imgName })
    let addedNote = await newNote.save()
    res.redirect(`/notes/${addedNote._id}/edit`)
  }
  catch (err) {
    console.log('something went wrong with text detection', err)
    res.render('notes/upload', { message: "Something went wrong. Please try another image which includes text." })
  }

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
  let arrayTags = tags.split(",").filter(el => el !== "")

  try {
    // Validation: check if user == owner
    // Validation not passed
    let note = await Note.findById(req.params.id)
    if (!note.owner.equals(req.user._id)) {
      res.redirect('/dashboard')
    } else {

      // Validation passed --> start updating the note
      // Update case: tags array is empty
      if (arrayTags.length === 0) {
        await Note.updateOne({ _id: req.params.id }, { $set: { title, text, owner: req.user, tags: [] } })
        res.redirect('/dashboard')
      }

      // Update case: tags array includes tags
      let tagIds = []
      arrayTags.map(async tag => {
        let tagObj = await Tag.findOne({ name: tag })
        switch (tagObj) {
          case null:
            let newTag = new Tag({ name: tag })
            let addedTag = await newTag.save()
            tagIds.push(addedTag._id)
            await Note.updateOne({ _id: req.params.id }, { $set: { title, text, owner: req.user, tags: tagIds } })
            break
          case tagObj:
            tagIds.push(tagObj._id)
            await Note.updateOne({ _id: req.params.id }, { $set: { title, text, owner: req.user, tags: tagIds } })
            break
        }
      })
    }
    res.redirect('/dashboard')
  }
  catch (err) {
    console.log('something went wrong with updating the note')
  }
})


// GET show a specific note
router.get('/:id', async (req, res, next) => {

  try {
    let note = await Note.findOne({ _id: req.params.id })
      .populate('tags')
      .populate('owner')
      .exec();

    let owner = note.owner.equals(req.user._id)

    res.render('notes/show', { note: note, user: req.user, owner })
  }
  catch (err) {
    console.log('something went wrong with showing the details page')
  }
})

module.exports = router;


