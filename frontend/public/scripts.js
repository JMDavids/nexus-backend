document.addEventListener('DOMContentLoaded', function() {
    // Create Account Form Submission
    const createAccountForm = document.querySelector('#tutorSignUpForm');
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Get form values
            const username = createAccountForm.querySelector('input[placeholder="Username"]').value;
            const firstName = createAccountForm.querySelector('input[placeholder="First name"]').value;
            const lastName = createAccountForm.querySelector('input[placeholder="Last name"]').value;
            const email = createAccountForm.querySelector('input[placeholder="E-mail"]').value;
            const password = createAccountForm.querySelector('input[placeholder="Password"]').value;
            const termsAccepted = createAccountForm.querySelector('#termsCheck').checked;

            // Validate form fields
            if (username && firstName && lastName && email && password && termsAccepted) {
                 // Data to be sent to the backend
                const userData = {
                    username,
                    firstName,
                    lastName,
                    email,
                    password,
                    role: "student"
                };

                try {
                    // Make API call to the register endpoint
                    const response = await fetch('http://localhost:3000/api/user/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // Registration successful
                        alert('Account created successfully!');
                        window.location.href = 'Tutor-Sign-in.html';  // Redirect to sign-in page
                    } else {
                        // Handle registration errors
                        alert(result.message || 'Failed to create account. Please try again.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error registering. Please try again later.');
                }
            } else {
                alert('Please fill in all fields and accept the terms of service.');
            }
        });
    }

    // Sign In Form Submission
    const signInForm = document.querySelector('#tutorSignInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Get form values
            const email = signInForm.querySelector('input[placeholder="E-mail"]').value;
            const password = signInForm.querySelector('input[placeholder="Password"]').value; // Include password

            // Validate email and password
            if (email && password) {
                const loginData = {
                    email,
                    password
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
                        alert(`Welcome back, ${result.user.firstName} ${result.user.lastName}!`);

                        // Store JWT token in localStorage or use cookies
                        localStorage.setItem('authToken', result.token);

                        // Redirect to dashboard based on role
                        window.location.href = result.role === 'tutor' ? 'tutor-dashboard.html' : 'student-dashboard.html';
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
