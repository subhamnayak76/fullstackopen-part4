const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');


const logger = require('../utils/logger')


loginRouter.post('/', async (request, response) => {
    try {
        const body = request.body;
        logger.info('Login attempt for username:', body.username);
        
        const user = await User.findOne({ username: body.username });
        logger.info('User found:', user ? 'Yes' : 'No');

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash);
    console.log('Password correct:', passwordCorrect);
    
    if (!(user && passwordCorrect)) {
        console.log('Authentication failed');
        return response.status(401).json({
            error: 'invalid username or password'
        });
    }
    
    const userForToken = {
        username: user.username,
        id: user.id,
        
    };
    console.log('User for token:', userForToken);
    console.log('SECRET:', process.env.SECRET);
    
    const token = jwt.sign(userForToken, process.env.SECRET);
    console.log('Generated token:', token);
    
    const responseBody = { token, username: user.username, name: user.name };
    console.log('Response body:', responseBody);
    
    response.status(200).json(responseBody);
} catch (error) {
    logger.error('Login error:', error);
    response.status(500).json({ error: 'Internal server error during login' });
}
});

module.exports = loginRouter;