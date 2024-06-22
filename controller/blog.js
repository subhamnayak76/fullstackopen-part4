
const blogsRouter = require('express').Router()
const Blog = require('../models/db')
require('express-async-errors')
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async(request, response, next) => {
    const blog = new Blog(request.body);
    
    try {
        const savedBlog = await blog.save();
        console.log('Blog saved:', savedBlog);
        response.status(201).json(savedBlog);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message })
        
    
        }
    }
})

blogsRouter.delete('/:id',async (request, response, next) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
}
)

blogsRouter.put('/:id',async (request, response, next) => {
    const body = request.body

    const blog = {
        likes: body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)

})

module.exports = blogsRouter