document.addEventListener('DOMContentLoaded', function() {
    // Sign In Form Submission
    const tutorSignInForm = document.querySelector('#tutorSignInForm');
    const studentSignInForm = document.querySelector('#studentSignInForm');
    const signInForm = tutorSignInForm || studentSignInForm;

    if (signInForm) {
        signInForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Get form values
            const email = signInForm.querySelector('input[placeholder="E-mail"]').value.trim();
            const password = signInForm.querySelector('input[placeholder="Password"]').value;

            // Get role from hidden input
            const role = signInForm.querySelector('input[name="role"]').value;

            // Validate email, password, and role
            if (email && password && role) {
                const loginData = {
                    email,
                    password,
                    role
                };

                try {
                    // Make API call to the login endpoint
                    const response = await fetch('http://localhost:3000/api/user/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(loginData)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // Login successful
                        const user = result.user;

                        // Ensure the user's role matches the role they logged in with
                        if (user.role === role) {
                            alert(`Welcome back, ${user.firstName} ${user.lastName}!`);

                            // Store JWT token and user data
                            localStorage.setItem('authToken', result.token);
                            localStorage.setItem('user', JSON.stringify(user));

                            // Redirect based on role
                            if (user.role === 'tutor') {
                                window.location.href = 'tutor-dashboard.html';
                            } else if (user.role === 'student') {
                                window.location.href = 'Student-Dashboard.html';
                            } else {
                                alert('Unknown user role. Please contact support.');
                            }
                        } else {
                            alert('Access denied. Please use the correct sign-in page for your account type.');
                        }
                    } else {
                        // Handle login errors
                        alert(result.message || 'Incorrect email or password.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error logging in. Please try again later.');
                }
            } else {
                alert('Please fill in both email and password.');
            }
        });
    }
});