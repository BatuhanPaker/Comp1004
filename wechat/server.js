// Import the Node.js modules.
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

// Express app and an HTTP server created.
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // connect socket.io to the server.

// Define the path for messages JSON .
const messagesFile = path.join(__dirname, 'messages.json');

// Messages are cleared when server starts.
fs.writeFile(messagesFile, JSON.stringify([], null, 2), err => {
    if (err) {
        console.error("Failed to clear messages file on start:", err);
    } else {
        console.log("Messages file cleared on server start.");
    }
});

// Static files from the 'public' directory.
app.use(express.static('public'));

// Array storing all messages.
let allMessages = [];

//  socket connection handling.
io.on('connection', (socket) => {
    console.log('A user connected');
    let username;

    // Listening for 'setUsername' events.
    socket.on('setUsername', (name) => {
        username = name;
        console.log(`Username set: ${username}`);
    });

    // Listening for 'chatMessage' events.
    socket.on('chatMessage', (data) => {
        const messageData = { username, message: data.message };
        allMessages.push(messageData);
        io.emit('message', messageData); // Broadcast message to all clients.
    });

    // Listening for 'saveMessages' events.
    socket.on('saveMessages', () => {
        console.log('Manual save requested by user.');
        saveAllMessages();
    });

    // Listening for 'loadMessages' events.
    socket.on('loadMessages', () => {
        console.log('Manual load requested by user.');
        loadAllMessages();
    });

    // User disconnection.
    socket.on('disconnect', () => {
        console.log(`${username || "A user"} disconnected`);
    });
});

// Define the port.
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// Function to save messages.
function saveAllMessages() {
    console.log('Saving messages to file...');
    fs.writeFile(messagesFile, JSON.stringify(allMessages, null, 2), err => {
        if (err) {
            console.error("Error writing to file:", err);
        } else {
            console.log('All messages have been saved to file.');
        }
    });
}

// Function to load messages.
function loadAllMessages() {
    console.log('Loading messages from file...');
    fs.readFile(messagesFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
        } else {
            allMessages = JSON.parse(data || "[]");
            console.log('Messages loaded from file and sent to clients.');
            io.emit('loadedMessages', allMessages); // Broadcast loaded messages to all clients.
        }
    });
}
