$(document).ready(function() {
    $('#login-form').submit(function(event) {
        event.preventDefault();
        
        // Get the username and password from the form
        const username = $('#username').val();
        const password = $('#password').val();
        
        // Make a POST request to the login endpoint
        $.post('/login', { username, password })
            .done(function(response) {
                // If login is successful, store user details in localStorage and redirect to the chat page
                localStorage.setItem('username', username);
                window.location.href = '/chat';
            })
            .fail(function(xhr, status, error) {
                $('#error-message').removeClass('d-none'); // Show the error message
            });
    });
});
