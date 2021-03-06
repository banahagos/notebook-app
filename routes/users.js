const express = require('express');
const router = express.Router();
const Note = require('../models/note')
const User = require('../models/user')
const uploadCloud = require('../config/cloudinary.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


// GET profile page
router.get('/profile', async (req, res, next) => {
  let user = await User.findOne({ _id: req.user._id })
  res.render('user/profile', { user: user })
})

//  POST delete account
router.post('/profile/:id/delete', async (req, res, next) => {
  await Note.deleteMany({ owner: req.user._id })
  await User.deleteOne({ _id: req.user._id })
  res.redirect('/')
})


// POST update profile
router.post('/profile', uploadCloud.single('image'), async (req, res, next) => {
  let { username, email } = req.body

  username = username.toLowerCase()
  email = email.toLowerCase()

  let imgPath = req.user.imgPath
  if (req.file) {
    imgPath = req.file.url
  }

  try {
    if (username === '' || email === '') {
      res.render('user/profile', { message: "Please fill in all fields", user: req.user })
      return;
    }

    const checkEmail = await User.findOne({ email })
    const checkUsername = await User.findOne({ username })

    if (checkEmail !== null && checkEmail.email !== req.user.email) {
      res.render('user/profile', { message: 'This email already exists', user: req.user })
      return
    }

    if (checkUsername !== null && checkUsername.username !== req.user.username) {
      res.render('user/profile', { message: 'This username exists', user: req.user })
      return
    }

    if (req.body.public) {
      await User.updateOne({ _id: req.user._id }, { $set: { username, email, public: true, imgPath } })
      res.redirect('/home')
    } else {
      await User.updateOne({ _id: req.user._id }, { $set: { username, email, public: false, imgPath } })
      res.redirect('/home')
    }

  }
  catch (err) {
    console.log('something went wrong with updating the profile', err)
    res.render('user/profile')
  }

})

// GET userpage 
router.get('/:username', async (req, res, next) => {
  try {
    req.params.username.toLocaleLowerCase()
    let owner = await User.findOne({ username: req.params.username })
    let notesList = await Note.find({ owner: owner._id })
      .populate('tags')
      .sort([['updated_at', -1]])

    notesList.forEach(n => {
      n.updated_at_iso = n.updated_at.toISOString()
    })

    notesList.forEach(n => {
      n.created_at_iso = n.created_at.toISOString()
    })

    res.render('user/userpage', { notesList: notesList, owner: owner, user: req.user })

  }
  catch (err) {
    console.log("something went wrong with getting the userpage", err)
  }

})



module.exports = router;

