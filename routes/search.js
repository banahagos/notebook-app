const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const Tag = require('../models/tag')


// GET search result
router.get('/', async (req, res, next) => {
  try {
    let trimmedQuery = req.query.tag.trim()
    let regex = new RegExp(`^${trimmedQuery}$`, 'i');
    let tags = await Tag.find({ name: regex })
    console.log(tags)
    let tagSearchResult = await Note.find({ tags: { $in: tags.map(e => e._id) } })
      .populate('tags')
      .populate('owner')
      .exec();

     
// should execute when search field is empty or the searched tag exists in the database but is not attached to a note
    if(tagSearchResult.length === 0){
      res.render('search/searchResult', { message: "No note found", user: req.user })
    } else {

// will execute when the seached tag is attached to note(s)
    let isPrivateUser = () => {
      if (tagSearchResult && trimmedQuery.length > 0) {
        return !tagSearchResult[0].owner.public
      }
    }


    let emptySearch = () => {
      if (trimmedQuery.length === 0) {
        return true
      }
    }

    let isPublicUser = () => {
      if (tagSearchResult && trimmedQuery.length > 0) {
        return tagSearchResult[0].owner.public
      }
    }

    if(tagSearchResult){
    tagSearchResult.forEach(n => {
      n.updated_at_iso = n.updated_at.toISOString()
    })

    tagSearchResult.forEach(n => {
      n.created_at_iso = n.created_at.toISOString()
    })
  }

    res.render('search/searchResult', { user: req.user, tagSearchResult: tagSearchResult, isPrivateUser, isPublicUser, emptySearch })
  }
}
  catch (err) {
    console.log('something went wrong with searching a tag')
    res.render('search/searchResult', { message: "No note found with this tag", user: req.user })
  }
})

module.exports = router;