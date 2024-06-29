const userRouter = require('express').Router()
const User = require('../models/UserSchema')
const middleware = require('../utils/middleware')
const bcrypt = require('bcrypt')
const Blog = require('../models/db')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})
userRouter.get('/myblogs', middleware.authenticateToken,async (req, res) => {
    try {
        // The user ID is attached to the request by the authenticateToken middleware
        const userId = req.user.id;
    
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Find all blogs where the author matches the user's ID
        const blogs = await Blog.find({ user: userId });
        console.log('Blogs:', blogs);
    
        res.json(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'An error occurred while fetching blogs' });
      }
    });
    


userRouter.post('/', async (request, response) => {
    const body = request.body
    const password = body.password
    if (password === undefined || password.length < 3) {
        return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
        
    })

    const savedUser = await user.save()
    response.json(savedUser)
})

userRouter.put('/:id', async (request, response) => {
    const body = request.body

    const user = {
        username: body.username,
        name: body.name,
        passwordHash: body.passwordHash
    }

    const updatedUser = await User.findByIdAndUpdate(request.params.id, user, { new: true })
    response.json(updatedUser)
})
module.exports = userRouter
