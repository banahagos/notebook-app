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

router.post('/profile/:id/delete', async (req, res, next) => {
  await Note.deleteMany({owner: req.user._id})
  await User.deleteOne({_id: req.user._id})
  res.redirect('/')
})


// POST update profile
router.post('/profile', uploadCloud.single('image'), async (req, res, next) => {
  let { username, email } = req.body

  username = username.toLowerCase()
  email = email.toLowerCase()

  let imgPath = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSrFZyRsNaziLT66g7YLrNbuaiCstEDLu9sLwK-0qQ8N1LkS_QUw'
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
      res.render('user/profile', { message: 'This email already exists', user: req.user})
      return
    }

    if (checkUsername !== null && checkUsername.username !== req.user.username) {
      res.render('user/profile', { message: 'This username exists', user: req.user})
      return
    }

    if (req.body.public) {
      await User.updateOne({ _id: req.user._id }, { $set: { username, email, public: true, imgPath } })
      res.redirect('/dashboard')
    } else {
      await User.updateOne({ _id: req.user._id }, { $set: { username, email, public: false, imgPath } })
      res.redirect('/dashboard')
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
    let user = await User.findOne({ username: req.params.username })
    if (user.public) {
      let notesList = await Note.find({ owner: user._id })
        .populate('tags')
        .sort([['updated_at', -1]])
      res.render('user/userpage', { notesList: notesList })
    }
    else {
      res.render('user/userpage', { message: "This page is private" })
    }
  }
  catch (err) {
    console.log("something went wrong with getting the userpage", err)
  }

})



module.exports = router;

