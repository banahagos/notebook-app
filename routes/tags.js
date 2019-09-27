const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const Tag = require('../models/tag')



router.get('/', async (req, res, next) => {
  try {
    let regex = new RegExp(req.query.tag, 'i');
    let tag = await Tag.findOne({ name: regex })
    let tagSearchResult = await Note.find({ tags: tag._id })
    .populate('tags')
    .populate('owner')
    .exec();
    console.log(tagSearchResult)
    res.render('tags/searchResult', { user: req.user, tagSearchResult: tagSearchResult })
  }
  catch (err) {
    console.log('something went wrong with searching a tag')
    res.render('tags/searchResult', { message: "No note found with this tag" })
  }
})

module.exports = router;