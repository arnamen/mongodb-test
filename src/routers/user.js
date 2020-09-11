const express = require('express')
const auth = require('../db/middleware/auth')
const User = require('../models/user')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken();
        await user.save()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {

    const loginData = req.body;

    try {
        const user = await User.findByCredentials(loginData.email, loginData.password)
        if(!user) throw new Error();
        const token = await user.generateAuthToken();
        res.send({user, token: token});
    } catch (error) {
        res.status(404).send('user not found');
    }
    
})

router.get('/users/test', async (req, res) => {
    try {
        const user = await User.findOne({email: 'reg@example.com'});
        res.send(user);   
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        //удалить текущий токен
        req.user.tokens = req.user.tokens.filter((tokenOjb) => { 
            return tokenOjb.token !== req.token
            }
        );
        await req.user.save();
        res.send('LOGGED OUT: ' + req.token);
    } catch (error) {
        console.log(error)
        res.status(500).send();
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('LOGGED OUT EVERYWHERE');
    } catch (error) {
        console.log(error)
        res.status(500).send();
    }
})

router.get('/users', auth, async (req, res) => {
    try {
        res.send({user: req.user, token: req.token})
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send({user})
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        const user = await User.findById(req.params.id);

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router