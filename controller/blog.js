
const blogsRouter = require('express').Router()
const Blog = require('../models/db')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async(request, response, next) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    await blog.save();
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