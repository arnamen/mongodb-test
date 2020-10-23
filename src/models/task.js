const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
        description: {
            type: String,
            required: true,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        owner: {
            type: ObjectId,
            required: true,
            ref: 'Task' //связь с документом, связанный с этим
        }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task