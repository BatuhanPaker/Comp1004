// Initialize the socket connection.
const socket = io();

// Variable to store the user's username.
let username = '';

// Event listener for username.
document.getElementById('set-username-button').addEventListener('click', () => {
    const inputUsername = document.getElementById('username-input').value.trim();
    if (inputUsername) {
        username = inputUsername;
        console.log('Username set:', username); // Log the set username to the browser console.
        document.getElementById('username-input').disabled = true; // Disable the username input field after setting.
        document.getElementById('set-username-button').disabled = true; // Disable the set username button after setting.
        socket.emit('setUsername', username); // Emit the setUsername event to the server.
    }
});

// Event listener for sending messages.
document.getElementById('send-button').addEventListener('click', () => {
    const message = document.getElementById('message-input').value.trim();
    if (message && username) {
        console.log('Sending message:', message); // Log the message being sent.
        socket.emit('chatMessage', { username, message }); // Emit the chatMessage event to the server.
        document.getElementById('message-input').value = ''; // Clear the message input field after sending.
    }
});

// Event listener for saving messages.
document.getElementById('save-messages-button').addEventListener('click', () => {
    console.log('Message saved successfully'); // Log the save request.
    socket.emit('saveMessages'); // Emit the saveMessages event to the server.
});

// Event listener for loading messages.
document.getElementById('load-messages-button').addEventListener('click', () => {
    console.log('Request to load messages'); // Log the load request.
    socket.emit('loadMessages'); // Emit the loadMessages event to the server.
});

// Handler for receiving messages.
socket.on('message', ({ username, message }) => {
    console.log('Received message:', {username, message}); // Log the received message.
    displayMessage(username, message); // Display the message on the chat window.
});

// Handler for loaded messages.
socket.on('loadedMessages', (messages) => {
    console.log('Loaded messages from server:', messages); // Log the messages loaded from the server.
    const chatWindow = document.getElementById('chat-messages');
    chatWindow.innerHTML = ''; // Clear the chat window before displaying loaded messages.
    messages.forEach(({ username, message }) => {
        displayMessage(username, message); // Display each loaded message.
    });
});

// Function to display messages in the chat window.
function displayMessage(username, message) {
    const chatWindow = document.getElementById('chat-messages');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message'); // Style the message container.
    const usernameElement = document.createElement('span');
    usernameElement.classList.add('username'); // Style the username part.
    usernameElement.textContent = `${username}: `;
    const messageElement = document.createElement('span');
    messageElement.textContent = message; // Add message text.
    messageContainer.appendChild(usernameElement);
    messageContainer.appendChild(messageElement);
    chatWindow.appendChild(messageContainer); // Append message container to chat window.
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll the latest message.
}
