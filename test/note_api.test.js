const { test, after, beforeEach, describe} = require('node:test');
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

test('if title and url properties are missing, respond with 400 Bad Request', async () => {
    const newblog = {
        author: 'Test Author',  
        likes: 1
    };
    await api
        .post('/api/blogs')
        .send(newblog)
        .expect(400);
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await blogsInDb();
        const blogToDelete = blogsAtStart[0];
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204);
        
        const blogsAtEnd = await blogsInDb();
        assert.strictEqual(blogsAtEnd.length, initialblogs.length - 1);

        const titles = blogsAtEnd.map(blog => blog.title);
        assert.strictEqual(titles.includes(blogToDelete.title), false);

      
});
test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '1234567890';
    await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400);
});
});

test('updating the likes of a blog post', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, updatedBlog.likes);
});
after(async () => {
    await mongoose.connection.close();
});