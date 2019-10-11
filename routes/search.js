const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const Tag = require('../models/tag')


// GET search result
router.get('/', async (req, res, next) => {
  try {
    let trimmedQuery = req.query.tag.trim()
    let regex = new RegExp(trimmedQuery, 'i');
    let tag = await Tag.findOne({ name: regex })
    let tagSearchResult = await Note.find({ tags: tag._id })
      .populate('tags')
      .populate('owner')
      .exec();

    let isPrivateUser = () => {
      if (!tagSearchResult[0].owner.public && tagSearchResult && trimmedQuery.length > 0) {
        return true
      }
    }

    let emptySearch = () => {
      if (trimmedQuery.length === 0) {
        return true
      }
    }

    let isPublicUser = () => {
      if (tagSearchResult[0].owner.public && trimmedQuery.length > 0) {
        return true
      }
    }

    res.render('search/searchResult', { user: req.user, tagSearchResult: tagSearchResult, isPublicUser, isPrivateUser, emptySearch })
  }
  catch (err) {
    console.log('something went wrong with searching a tag')
    res.render('search/searchResult', { message: "No note found with this tag", user: req.user })
  }
})

module.exports = router;