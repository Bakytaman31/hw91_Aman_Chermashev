const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const User = require('../models/User');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', bodyParser.json(),async (req, res) => {
    try {
        const userData = {
            username: req.body.username,
            password: req.body.password
        };
        const user = new User(userData);
        user.generateToken();
        await user.save();
        return res.send(user);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

router.post('/sessions', bodyParser.json(),async (req, res) => {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
        return res.status(400).send({error: 'Username or password not correct!'});
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        return res.status(400).send({error: 'Username or password not correct!'});
    }

    user.generateToken();

    await user.save();

    return res.send(user);
});

router.delete('/sessions', auth,async (req, res) => {
    const success = {message: 'Success'};

    try {
        const user = req.user;

        user.generateToken();
        await user.save();

        return res.send(success);
    } catch (e) {
        return res.send(success);
    }
});

module.exports = router;