const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
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
        console.log(e)
        res.status(400).send()
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

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        updates.forEach((update) => req.user[update] = req.body[update]);

        await req.user.save();

        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user.name + ' ' + 'was deleted')
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jp(e)?g|png)$/)){
            cb(new Error('must be an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    try {
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send()
    }
}, (error, req, res, next) => {
    res.status(400).send(error.message)
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send()
    }
}, (error, req, res, next) => {
    res.status(400).send(error.message)
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
})

module.exports = router