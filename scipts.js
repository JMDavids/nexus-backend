document.addEventListener('DOMContentLoaded', function() {
    // Create Account Form Submission
    const createAccountForm = document.querySelector('form');
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form values
            const username = createAccountForm.querySelector('input[placeholder="Username"]').value;
            const firstName = createAccountForm.querySelector('input[placeholder="First name"]').value;
            const lastName = createAccountForm.querySelector('input[placeholder="Last name"]').value;
            const email = createAccountForm.querySelector('input[placeholder="E-mail"]').value;
            const termsAccepted = createAccountForm.querySelector('#termsCheck').checked;

            // Validate form fields
            if (username && firstName && lastName && email && termsAccepted) {
                // Store user data in localStorage
                const user = {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                };

                localStorage.setItem('user', JSON.stringify(user));

                // Redirect to the sign-in page
                alert('Account created successfully!');
                window.location.href = 'sign-in.html';
            } else {
                alert('Please fill in all fields and accept the terms of service.');
            }
        });
    }

    // Sign In Form Submission
    const signInForm = document.querySelector('form');
    if (signInForm) {
        signInForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form values
            const email = signInForm.querySelector('input[placeholder="E-mail"]').value;

            // Retrieve user data from localStorage
            const storedUser = localStorage.getItem('user');
            const user = storedUser ? JSON.parse(storedUser) : null;

            // Check if email matches the stored user
            if (user && user.email === email) {
                alert(`Welcome back, ${user.firstName} ${user.lastName}!`);
                // Redirect to a different page or perform other actions
            } else {
                alert('Incorrect email or password.');
            }
        });
    }
});
