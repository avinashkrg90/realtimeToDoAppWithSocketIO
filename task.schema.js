// no need to change the prewritten code
import mongoose from 'mongoose'
// make necessary imports here

// Define the Task schema
const taskSchema = new mongoose.Schema({
    // ------write your code here.-------
    text:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

// Create a Task model from the schema
const Task = mongoose.model('Task', taskSchema);

export default Task;
