const {test ,after} = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

test.only('blogs  are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
after(async () => { 
    mongoose.connection.close()
})

test.only('there are 1 blog', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 3)
})

test.only('it verfiy the unique identifier property of the blog posts is named id', async () => {

    const response = await api.get('/api/blogs')
    blogs.forEach(blog => {
        assert.strictEqual(blog.hasOwnProperty('id'), true);
        assert.strictEqual(blog.hasOwnProperty('_id'), false);
      });
})