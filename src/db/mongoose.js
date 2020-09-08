const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

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

const task = new Task({
    userName: 'myUserName',
    description: 'task12312',
});

task.save()
.then((result) => {
    console.log(result);
}).catch((err) => {
    console.log('error! ', err);
});