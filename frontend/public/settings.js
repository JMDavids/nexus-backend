document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.querySelector('#settingsForm');
    if (settingsForm) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            // Pre-fill the form with current user information
            document.getElementById('username').value = user.username || '';
            document.getElementById('email').value = user.email || '';
            // Do not pre-fill the password field for security reasons
        } else {
            // User is not logged in, redirect to login page
            //window.location.href = 'SignIn.html';
        }

        // Add event listener to form submit within the if block to ensure settingsForm is defined
        settingsForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Get the updated values from the form
            const updatedUsername = document.getElementById('username').value.trim();
            const updatedEmail = document.getElementById('email').value.trim();
            const updatedPassword = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Prepare the data to send to the server
            const updatedData = {};
            if (updatedUsername) updatedData.username = updatedUsername;
            if (updatedEmail) updatedData.email = updatedEmail;

            // Validate password confirmation
            if (updatedPassword || confirmPassword) {
                if (updatedPassword !== confirmPassword) {
                    alert('Passwords do not match. Please try again.');
                    return;
                }

                updatedData.password = updatedPassword;
            }

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    alert('You are not authenticated. Please log in.');
                    window.location.href = 'SignIn.html';
                    return;
                }

                // Make API call to update user settings
                const response = await fetch('/api/user/settings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Your settings have been updated successfully.');

                    // Update user data in localStorage
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (updatedUsername) user.username = updatedUsername;
                    if (updatedEmail) user.email = updatedEmail;
                    // Do not store password in localStorage
                    localStorage.setItem('user', JSON.stringify(user));

                    // Optionally, redirect or refresh the page
                    // location.reload();
                } else {
                    alert(result.message || 'Error updating settings. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating settings. Please try again later.');
            }
        });

    } else {
        // User is not logged in, redirect to login page
        //window.location.href = 'SignIn.html';
    }
});