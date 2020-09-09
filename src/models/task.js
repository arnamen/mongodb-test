const mongoose = require('mongoose');
const validator = require('validator');

const Task = mongoose.model('Tasks', {
    userName: {
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
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false,
    }
});

module.exports = Task;