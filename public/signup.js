$(document).ready(function() {
    $('#signup-form').submit(function(event) {
        // Prevent form submission if any field is invalid
        if ($('#signup-form')[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Add Bootstrap's was-validated class to enable styling for invalid fields
        $('#signup-form').addClass('was-validated');
    });

    // Handle successful signup response
    $('#signup-form').on('submit', function(event) {
        event.preventDefault();

        // Get form data
        const formData = {
            firstname: $('#firstname').val().trim(),
            lastname: $('#lastname').val().trim(),
            username: $('#username').val().trim(),
            password: $('#password').val().trim()
        };

        // Send signup request
        $.post('/signup', formData)
            .done(function(response) {
                if (response === 'Signup successful') {
                    // Redirect to login page after successful signup
                    window.location.href = '/login';
                } else {
                    // Display error message if signup failed
                    $('#error-message').text(response).removeClass('d-none'); // Show error message
                }
            })
            .fail(function(error) {
                console.error('Error:', error);
            });
    });
});
