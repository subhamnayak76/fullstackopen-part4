
const blogsRouter = require('express').Router()
const Blog = require('../models/db')

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
        console.error('Error saving blog:', error);
        next(error);
    }
})

blogsRouter.delete('/:id',async (request, response, next) => {
    const id = request.params.id
    const blog = await Blog.findByIdAndDelete(id)
    response.status(204).res.json(blog)
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