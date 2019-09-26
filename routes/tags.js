const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const Tag = require('../models/tag')



router.get('/', async (req, res, next) => {
  try {
    let tag = await Tag.findOne({ name: req.query.tag})
    let tagSearchResult = await Note.find({ tags: tag._id }).populate('tags')
    console.log(tagSearchResult)
    res.render('tags/searchResult', { tagSearchResult })
  }
  catch (err) {
    console.log('something went wrong with searching a tag')
    res.render('tags/searchResult')
  }
})

module.exports = router;