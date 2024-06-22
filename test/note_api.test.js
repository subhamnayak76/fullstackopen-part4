const { test, after, beforeEach } = require('node:test');
const assert = require('assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/db');
const { initialblogs, blogsInDb } = require('../utils/helper');

beforeEach(async () => {
    await Blog.deleteMany({});
    for (let blog of initialblogs) {
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
});

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('there are 3 blogs', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, 3);
});

test('it verifies the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
        assert.strictEqual(blog.hasOwnProperty('id'), true);
        assert.strictEqual(blog.hasOwnProperty('_id'), false);
    });
});

test('if posting a blog is successful', async () => {
    const newblog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 1
    };

    console.log('Sending POST request...');
    const response = await api
        .post('/api/blogs')
        .send(newblog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
    console.log('POST request completed');
    console.log('Response body:', response.body);

    const blogs = await blogsInDb();
    console.log('Blogs in DB after POST:', blogs);
    assert.strictEqual(blogs.length, initialblogs.length + 1);
});

test('if likes property is missing, it will default to 0', async () => {
    const newblog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://testurl.com'
    };
    const response = await api
    .post('/api/blogs')
    .send(newblog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
})

after(async () => {
    await mongoose.connection.close();
});