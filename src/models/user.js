const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('users', {
    name: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.default.isLength(value,{
                min: 0,
                max: 15
            })) throw new Error('Username length out of range (1~15)');
        }
    },
    age: {
        type: Number,
        required: true,
    },
});

module.exports = User;