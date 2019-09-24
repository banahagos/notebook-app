const mongoose = require('mongoose')
const Schema = mongoose.Schema


const tagSchema = new Schema({
  name: { type: String },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag