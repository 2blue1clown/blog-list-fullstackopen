const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

console.log('connecting to ',process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
    console.log('connected to MONGODB')
  })
  .catch(error =>{
    console.log('error connecting to MONGODB:',error.message)
  })

module.exports = mongoose.model('Blog', blogSchema)