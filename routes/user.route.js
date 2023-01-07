const { UserModel } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body }   = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields')

router.post('/login', [
    body('email','Email invalid').isEmail(),
    body('password', 'Password required').not().isEmpty(), 
    body('password', 'Password must contain more than 6 characters').isLength({ min : 6}),
    validateFields] , 
    async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send('The user not found');
        }

        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const secret = process.env.secret;
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                secret,
                { expiresIn: '1d' }
            );

            res.status(200).send({ user, token: token });
        } else {
            res.status(400).send('password is wrong!');
        }
    } catch (error) {
        next(error)
    }
    
});

router.post('/register',[
    body('email','Email invalid').isEmail(),
    body('password', 'Password required').not().isEmpty(), 
    body('password', 'Password must contain more than 6 characters').isLength({ min : 6}),
    validateFields
], async (req, res, next) => {
    try {
        const {name, password, lastName, address, city, state, country, email} = req.body

        let user = new UserModel({
            name: name,
            lastName: lastName,
            address: address,
            city: city,
            state: state,
            country: country,
            email: email,
            passwordHash: bcrypt.hashSync(password, 10),
        });
        user = await user.save();

        if (!user) return res.status(400).send('the user cannot be created!');

        res.send(user);
    } catch (error) {
        next(error)
    }
});

module.exports = router