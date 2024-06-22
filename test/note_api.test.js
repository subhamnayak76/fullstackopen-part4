const { test, after, beforeEach } = require('node:test');
const assert = require('assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const co = require('co');
const app = require('../app'); // Ensure app is correctly exported and does not listen by itself
const api = supertest(app);
const Blog = require('../models/db');
const { initialblogs, blogsInDb } = require('../utils/helper');

// Debugging to verify `initialblogs`
console.log('Initial Blogs:', initialblogs);
console.log('Type of initialblogs:', typeof initialblogs);
console.log('Is initialblogs iterable?', Array.isArray(initialblogs));
console.log(initialblogs);

// Increase Mongoose timeout settings
mongoose.set('bufferCommands', false);
mongoose.connect('mongodb://localhost:27017/blog_test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,  // 5 seconds timeout for initial connection
  socketTimeoutMS: 45000,         // 45 seconds timeout for all operations
});

beforeEach(function (done) {
    co(function* () {
        console.log('Deleting existing blogs...');
        yield Blog.deleteMany({});
        console.log('Inserting initial blogs...');
        for (let blog of initialblogs) {
            let blogObject = new Blog(blog);
            yield blogObject.save();
        }
        console.log('Setup complete.');
    }).then(done, done);
});

test('blogs are returned as json', function (done) {
    console.log('Running test: blogs are returned as json');
    api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end(function () {
            co(function* () {
                console.log('Test passed: blogs are returned as json');
            }).then(done, done);
        });
});

after(function (done) {
    co(function* () {
        console.log('Closing mongoose connection...');
        yield mongoose.connection.close();
        console.log('Mongoose connection closed.');
    }).then(done, done);
});

test('there are 3 blogs', function (done) {
    console.log('Running test: there are 3 blogs');
    api.get('/api/blogs')
        .end(function () {
            co(function* () {
                const response = yield api.get('/api/blogs');
                assert.strictEqual(response.body.length, 3);
                console.log('Test passed: there are 3 blogs');
            }).then(done, done);
        });
});

test('it verifies the unique identifier property of the blog posts is named id', function (done) {
    console.log('Running test: it verifies the unique identifier property of the blog posts is named id');
    api.get('/api/blogs')
        .end(function () {
            co(function* () {
                const response = yield api.get('/api/blogs');
                response.body.forEach(blog => {
                    assert.strictEqual(blog.hasOwnProperty('id'), true);
                    assert.strictEqual(blog.hasOwnProperty('_id'), false);
                });
                console.log('Test passed: it verifies the unique identifier property of the blog posts is named id');
            }).then(done, done);
        });
});

test('if posting a blog is successful', function (done) {
    console.log('Running test: if posting a blog is successful');
    const newblog = {
        title: 'spp',
        author: 'dft',
        url: 'tdfsf',
        likes: 1
    };

    api.post('/api/blogs')
        .send(newblog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .end(function () {
            co(function* () {
                const blogs = yield blogsInDb();
                assert.strictEqual(blogs.length, 4);
                console.log('Test passed: if posting a blog is successful');
            }).then(done, done);
        });
});

after(function (done) {
    co(function* () {
        console.log('Closing mongoose connection...');
        yield mongoose.connection.close();
        console.log('Mongoose connection closed.');
    }).then(done, done);
});
