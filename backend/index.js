
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogRouter = require('./controllers/blog')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

logger.info('connecting to ',config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(result => {
    logger.info('connected to MONGODB')
  })
  .catch(error =>{
    logger.info('error connecting to MONGODB:',error.message)
  })

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/blogs',blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

