const userRouter = require('express').Router()
const User = require('../models/UserSchema')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

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
