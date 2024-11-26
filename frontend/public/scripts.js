
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.querySelector('#forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Get the email value
            const emailInput = forgotPasswordForm.querySelector('input[placeholder="E-mail"]');
            const email = emailInput.value.trim();

            if (email) {
                try {
                    // Make API call to request password reset
                    const response = await fetch('/api/user/forgot-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert('A password reset link has been sent to your email address.');
                    } else {
                        alert(result.message || 'Error sending reset link. Please try again.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error sending reset link. Please try again later.');
                }
            } else {
                alert('Please enter your email address.');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Check if on the reset password page
    const resetPasswordForm = document.querySelector('#resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const email = urlParams.get('email');

            if (!token || !email) {
                alert('Invalid or missing token. Please request a new password reset.');
                return;
            }

            // Get the new passwords
            const newPassword = resetPasswordForm.querySelector('input[placeholder="New Password"]').value;
            const confirmPassword = resetPasswordForm.querySelector('input[placeholder="Confirm New Password"]').value;

            if (newPassword !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            try {
                // Make API call to reset password
                const response = await fetch('/api/user/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, token, password: newPassword })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Your password has been reset successfully.');
                    window.location.href = 'SignIn.html';
                } else {
                    alert(result.message || 'Error resetting password. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error resetting password. Please try again later.');
            }
        });
    }
});