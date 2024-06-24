
const blogsRouter = require('express').Router()
const Blog = require('../models/db')
const User = require('../models/UserSchema')
require('express-async-errors')
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async(request, response, next) => {
    const body = request.body
    const user = await User.findById(body.userId)
     const blog = new Blog({
         title: body.title,
         author: body.author,
            url: body.url,
            likes: body.likes,
            user: user.id
})
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    response.json(savedBlog)
})

blogsRouter.delete('/:id',async (request, response, next) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
}
)

blogsRouter.put('/:id',async (request, response, next) => {
    const body = request.body
    
    const blog = {
        blog : body.blogs,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)

})

module.exports = blogsRouter