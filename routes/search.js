const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const Tag = require('../models/tag')


// GET search result
router.get('/', async (req, res, next) => {
  try {
    let regex = new RegExp(req.query.tag, 'i');
    let tag = await Tag.findOne({ name: regex })
    let tagSearchResult = await Note.find({ tags: tag._id })
      .populate('tags')
      .populate('owner')
      .exec();
    
      let isPrivateUser = () => {
        if(!tagSearchResult[0].owner.public && tagSearchResult && req.query.tag){
          return true
        }
      } 

      let emptySearch = () => {
        if(!req.query.tag){
          return true
        }
      }

      let isPublicUser = () => {
        if(tagSearchResult[0].owner.public && req.query.tag){
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