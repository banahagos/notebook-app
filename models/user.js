const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
  googleID: { type: String },
  imageURL: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSrFZyRsNaziLT66g7YLrNbuaiCstEDLu9sLwK-0qQ8N1LkS_QUw' },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User