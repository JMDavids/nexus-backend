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

            const subjectCheckboxes = createAccountForm.querySelectorAll('input[name="subjects"]:checked');
            const subjects = Array.from(subjectCheckboxes).map(checkbox => checkbox.value);

            // Validate form fields
            if (username && firstName && lastName && email && password && termsAccepted) {
                 // Data to be sent to the backend
                const userData = {
                    username,
                    firstName,
                    lastName,
                    email,
                    password,
                    role: "tutor",
                    subjects 
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
},

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
                                    window.location.href = 'student-dashboard.html';
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
    }));
    


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
                    const response = await fetch('http://localhost:3000/api/user/forgot-password', {
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
                const response = await fetch('http://localhost:3000/api/user/reset-password', {
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
            window.location.href = 'SignIn.html';
        }
    }
});

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
    if (updatedPassword) updatedData.password = updatedPassword;

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
        const response = await fetch('http://localhost:3000/api/user/settings', {
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



//calendar
const calendarBody = document.getElementById('calendarBody');
        const monthYear = document.getElementById('monthYear');
        const prevMonthButton = document.getElementById('prevMonth');
        const nextMonthButton = document.getElementById('nextMonth');

        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        function generateCalendar(month, year) {
            calendarBody.innerHTML = '';
            monthYear.innerHTML = `${monthNames[month]} ${year}`;

            let firstDay = (new Date(year, month)).getDay();
            let daysInMonth = 32 - new Date(year, month, 32).getDate();
            
            let date = 1;
            for (let i = 0; i < 6; i++) {
                let row = document.createElement('tr');

                for (let j = 0; j < 7; j++) {
                    let cell = document.createElement('td');
                    if (i === 0 && j < firstDay) {
                        let cellText = document.createTextNode('');
                        cell.appendChild(cellText);
                    } else if (date > daysInMonth) {
                        break;
                    } else {
                        let cellText = document.createTextNode(date);

                        // Check if this is the current date
                        if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                            cell.classList.add('current-day');  // Highlight current day
                        }

                        cell.appendChild(cellText);
                        date++;
                    }
                    row.appendChild(cell);
                }
                calendarBody.appendChild(row);
            }
        }

        prevMonthButton.addEventListener('click', () => {
            currentMonth = (currentMonth - 1 + 12) % 12;
            if (currentMonth === 11) currentYear--;
            generateCalendar(currentMonth, currentYear);
        });

        nextMonthButton.addEventListener('click', () => {
            currentMonth = (currentMonth + 1) % 12;
            if (currentMonth === 0) currentYear++;
            generateCalendar(currentMonth, currentYear);
        });

        generateCalendar(currentMonth, currentYear);
