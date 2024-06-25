
const blogsRouter = require('express').Router()
const Blog = require('../models/db')
const User = require('../models/UserSchema')
require('express-async-errors')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate()
    response.json(blogs)
})

blogsRouter.post('/',  async (req, res) => {
    const { title, author, url, likes } = req.body
    const user = req.user
  
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id  // Make sure this line is present
    })
  
    const savedBlog = await blog.save()
    
    // Also add the blog to the user's blogs array
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  
    res.status(201).json(savedBlog)
  })
    blogsRouter.delete('/:id', async (req, res) => {
        const blogId = req.params.id
        const blog = await Blog.findById(blogId)
      
        console.log('Blog:', blog)
        console.log('Req.user:', req.user)
      
        if (!blog) {
          return res.status(404).json({ error: 'blog not found' })
        }
      
        console.log('Blog.user:', blog.user)
        console.log('Req.user._id:', req.user._id)
      
        // More defensive checks
        if (!blog.user) {
          return res.status(400).json({ error: 'blog has no associated user' })
        }
      
        if (!req.user || !req.user._id) {
          return res.status(401).json({ error: 'user authentication failed' })
        }
      
        const blogUserId = blog.user.toString ? blog.user.toString() : blog.user
        const reqUserId = req.user._id.toString ? req.user._id.toString() : req.user._id
      
        if (blogUserId !== reqUserId) {
          return res.status(403).json({ error: 'only the creator can delete this blog' })
        }
      
        await Blog.findByIdAndDelete(blogId)
        res.status(204).end()
      })
blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id, 
        { title, author, url, likes },
        { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedBlog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    response.json(updatedBlog)
})

module.exports = blogsRouter