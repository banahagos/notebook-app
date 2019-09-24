const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema({
  title: { type: String },
  text: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note