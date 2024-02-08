$(document).ready(function() {
    const socket = io();

    // Join a room upon successful login
    const username = localStorage.getItem('username');
    const roomList = ['devops', 'cloud computing', 'covid19', 'sports', 'nodeJS']; // List of available rooms
    roomList.forEach(room => {
        $('#room-list').append(`<option value="${room}">${room}</option>`);
    });

    $('#join-room-btn').click(function() {
        const selectedRoom = $('#room-list').val();
        socket.emit('join room', selectedRoom);
        $('#current-room').text(selectedRoom);
    });

    // Handle leaving a room
    $('#leave-room-btn').click(function() {
        const room = $('#current-room').text();
        socket.emit('leave room', room);
        $('#current-room').text('');
    });

    // Handle sending chat messages
    $('#chat-form').submit(function(event) {
        event.preventDefault();
        const message = $('#message-input').val().trim();
        const room = $('#current-room').text();
        if (message !== '') {
            socket.emit('chat message', { room, username, message });
            $('#message-input').val('');
        }
    });

    // Handle user logout
    $('#logout-btn').click(function() {
        localStorage.removeItem('username');
        window.location.href = '/login.html';
    });

    // Receive chat messages
    socket.on('chat message', function(data) {
        $('#chat-messages').append(`<p><strong>${data.username}:</strong> ${data.message}</p>`);
        scrollChatToBottom();
    });

    // Receive typing indicator
    socket.on('typing', function(message) {
        $('#typing-indicator').text(message);
    });

    // Scroll chat to bottom
    function scrollChatToBottom() {
        $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
    }
});
