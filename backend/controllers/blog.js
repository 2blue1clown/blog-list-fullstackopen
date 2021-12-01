const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (!request.body.likes) {
    blog.likes = 0
  }

  if (!request.body.url || !request.body.title) {
    response.status(400).end()
  }
  else {

    const result = await blog.save()
    response.status(201).json(result)
  }
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {

  const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  response.json(result)

})

module.exports = blogRouter