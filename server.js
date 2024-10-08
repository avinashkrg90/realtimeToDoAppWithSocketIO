// Complete the server.js file to make user's add, delete and update the todos.
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import Task from './task.schema.js';

export const app = express();
app.use(cors());

export const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Connection made.");

    socket.on("join", async (data) => {
        try{
            const tasks = await Task.find().sort({createdAt:1});
            socket.emit('previousTasks', tasks)
        }catch(err){
            console.log(err)
        }
    });

    socket.on("addTodo", async (data) => {
        const toDo = new Task({
            text: data,
        })
        const savedData = await toDo.save();
        const taskId = toDo._id;
        socket.emit("newTodoAdded", {text: data, completed: false, id:taskId.toString()});
        socket.broadcast.emit("newTodoAdded", {text: data, completed: false, id:taskId.toString()});
    });

    socket.on("deleteTodo", async (taskId) => {
        const task = await Task.findByIdAndRemove(taskId);
        socket.emit("deleteTask", taskId);
        socket.broadcast.emit("deleteTask", taskId);
    });

    socket.on("toggleTodo", async (taskId) => {
        const task = await Task.findById(taskId);
        if (task.completed){
            task.completed = false;
        }else{
            task.completed = true;
        }
        await task.save();

        socket.broadcast.emit("toggleTask", {taskId: taskId, completed : task.completed});
    });

    socket.on("disconnect", () => {
        console.log("Connection disconnected.");
    });
});


