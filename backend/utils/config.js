require('dotenv').config()

const PORT = process.env.PORT


//process.env.NODE_ENV is set in the command line script called by npm run dev || test || start
const MONGODB_URI = (process.env.NODE_ENV === 'test') ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

module.exports = {
  PORT,
  MONGODB_URI
}