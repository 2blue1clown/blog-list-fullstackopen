const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

logger.info('connecting to ',config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(result => {
    logger.info('connected to MONGODB')
  })
  .catch(error =>{
    logger.info('error connecting to MONGODB:',error.message)
  })

module.exports = mongoose.model('Blog', blogSchema)