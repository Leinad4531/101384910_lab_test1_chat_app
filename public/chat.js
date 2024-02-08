$(document).ready(function() {
    const socket = io(); 
    let currentRoom = null;

    // Handle joining a room
    $('#join-room-btn').click(function() {
        const room = $('#room-select').val();
        if (room !== '' && room !== currentRoom) {
            if (currentRoom) {
                socket.emit('leave room', currentRoom);
            }
            socket.emit('join room', room); // Join the selected room
            currentRoom = room;
            $('#room-select').prop('disabled', true); 
            $('#join-room-btn').prop('disabled', true); 
            $('#leave-room-btn').show(); 
            $('#chat-room').show(); 
        }
    });

    // Handle leaving the current room
    $('#leave-room-btn').click(function() {
        if (currentRoom) {
            socket.emit('leave room', currentRoom); 
            currentRoom = null;
            $('#room-select').prop('disabled', false); 
            $('#join-room-btn').prop('disabled', false);
            $('#leave-room-btn').hide();
            $('#chat-room').hide();
            $('#chat-messages').empty();
        }
    });


    
    // Handle sending chat messages
    $('#send-message-btn').click(function() {
        const message = $('#message-input').val().trim();
        if (message !== '') {
            socket.emit('chat message', { from_user: 'User', room: currentRoom, message: message }); // Send message to server
            $('#message-input').val('');
        }
    });

    // Receive chat messages from server
    socket.on('chat message', function(data) {
        $('#chat-messages').append(`<p><strong>${data.from_user}:</strong> ${data.message}</p>`); // Display message in chat
        scrollChatToBottom(); // Scroll chat to bottom
    });

    // Handle typing
    $('#message-input').on('input', function() {
        const room = $('#room-select').val();
        socket.emit('typing', { room });
        $('#typing-indicator').text('User is typing...');
    });

    // Handle typing stopped
    $('#message-input').on('blur', function() {
        const room = $('#room-select').val();
        socket.emit('typing stopped', { room });
        $('#typing-indicator').text('');
    });

    // Receive typing events from server
    socket.on('typing', function(message) {
        $('#typing-indicator').text(message);
    });

    // Receive typing stopped events from server
    socket.on('typing stopped', function() {
        $('#typing-indicator').text('');
    });

    // Handle logout button click
    $('#logout-btn').click(function() {
        console.log('Logout button clicked');
        $.get('/logout', function() {
            // Redirect to the signup page after logout
            console.log('Logout successful'); 
            window.location.href = '/signup';
        });
    });


    // Scroll chat to bottom
    function scrollChatToBottom() {
        $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
    }
});
