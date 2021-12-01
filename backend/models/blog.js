const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

//doing this because the _id property looks like a string but is not, and we want to use an id property so that we can identify the blogs with a string. We also just dont care about the __v mongo versioning.
blogSchema.set('toJSON', {
  transform: (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Blog', blogSchema)