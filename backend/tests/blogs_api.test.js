const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = initialBlogs.map(blog => new Blog(blog))//map blogs to mongoose objects
  const promiseArray = blogObjects.map(blog => blog.save())// map mongoose objects to promises
  await Promise.all(promiseArray)//transforms an array of promises into a single promise
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)


test('blogs are the correct length', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('id property exists', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => expect(blog.id).toBeDefined())
})

test('can create new blog', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

  await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length + 1)
  // This line uses destructuring assignment to assign values from an object to a new object
  const contents = response.body.map(({ author, likes, title, url }) => ({ author, likes, title, url }))
  console.log(contents)
  expect(contents).toContainEqual(newBlog)

}, 100000)

test('missing likes property is filled with 0', async () => {
  const noLikesBlog = {
    author: 'Michael Chan',
    title: 'React patterns',
    url: 'https://reactpatterns.com/'
  }
  const response = await api.post('/api/blogs').send(noLikesBlog)
  expect(response.body.likes).toBe(0)


})

test('no posts without title and/or url', async () => {
  const badBlogs = [
    {
      author: 'Michael Chan',
      title: 'React patterns',
    },
    {
      author: 'Michael Chan',
      url:'localhost:3001'
    },
    {
      author: 'Michael Chan',
    },
  ]
  const promiseArray = badBlogs.map(blog => api.post('/api/blogs').send(blog))
  const responses = await Promise.all(promiseArray)
  responses.forEach((response,index) => {
    console.log(index)
    expect(response.status).toBe(400)})



}, 100000)

afterAll(() => {
  mongoose.connection.close()
})