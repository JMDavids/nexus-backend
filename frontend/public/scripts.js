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

    } else {
        // User is not logged in, redirect to login page
        //window.location.href = 'SignIn.html';
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const createClassForm = document.getElementById('createClassForm');
    if (createClassForm) {
        createClassForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Get form values
            const subject = document.getElementById('subject').value;
            const title = document.getElementById('title').value.trim();
            const date = document.getElementById('date').value;
            const startTime = document.getElementById('start-time').value;
            const endTime = document.getElementById('end-time').value;
            const isOnline = document.getElementById('isOnline').checked;

            // Validate input
            if (!subject || !title || !date || !startTime || !endTime) {
                alert('Please fill in all required fields.');
                return;
            }

            const classData = {
                subject,
                title,
                date,
                startTime,
                endTime,
                isOnline
            };

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    alert('You are not authenticated. Please log in.');
                    window.location.href = 'SignIn.html';
                    return;
                }

                const response = await fetch('http://localhost:3000/api/class/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(classData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Class scheduled successfully. Now, you will be redirected to Zoom to schedule a Zoom session. Once done, please go to your inbox to send the learners the Zoom ID and password.g');
                    // Optionally, redirect or reset form
                    createClassForm.reset();
                    if (isOnline) {
                     
                        const zoomLink = `https://www.zoom.us/signin#/login`;
                
                        // Redirect to Zoom link
                        window.location.href = zoomLink;
                    } 
                } else {
                    alert(result.message || 'Error scheduling class. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error scheduling class. Please try again later.');
            }
            
            if (isOnline) {
               
                const zoomLink = `https://www.zoom.us/signin#/login`;
        
                // Redirect to Zoom link
                window.location.href = zoomLink;
            } 
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const editClassForm = document.getElementById('editClassForm');
    if (editClassForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const classId = urlParams.get('classId');
        console.log('Class ID from URL:', classId);

        if (!classId) {
            alert('Class ID not provided.');
            window.location.href = 'tutor-dashboard.html';
            return;
        }

        // Set classId in hidden field
        document.getElementById('classId').value = classId;

        // Fetch class details
        fetchClassDetails(classId);

        async function fetchClassDetails(classId) {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    alert('You are not authenticated. Please log in.');
                    window.location.href = 'SignIn.html';
                    return;
                }

                const response = await fetch(`http://localhost:3000/api/class/${classId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    const classData = result.class;
                    populateForm(classData);
                } else {
                    alert(result.message || 'Error fetching class details.');
                    window.location.href = 'tutor-dashboard.html';
                }
            } catch (error) {
                console.error('Error fetching class details:', error);
                alert('Error fetching class details. Please try again later.');
            }
        }

        function populateForm(classData) {
            document.getElementById('subject').value = classData.subject;
            document.getElementById('title').value = classData.title;
            document.getElementById('date').value = new Date(classData.date).toISOString().substr(0, 10);
            document.getElementById('start-time').value = classData.startTime;
            document.getElementById('end-time').value = classData.endTime;
            document.getElementById('isOnline').checked = classData.isOnline;
        }

        editClassForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const classId = document.getElementById('classId').value;

            // Get form values
            const subject = document.getElementById('subject').value;
            const title = document.getElementById('title').value.trim();
            const date = document.getElementById('date').value;
            const startTime = document.getElementById('start-time').value;
            const endTime = document.getElementById('end-time').value;
            const isOnline = document.getElementById('isOnline').checked;

            // Validate input
            if (!subject || !title || !date || !startTime || !endTime) {
                alert('Please fill in all required fields.');
                return;
            }

            const classData = {
                subject,
                title,
                date,
                startTime,
                endTime,
                isOnline
            };

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    alert('You are not authenticated. Please log in.');
                    window.location.href = 'SignIn.html';
                    return;
                }

                const response = await fetch(`http://localhost:3000/api/class/${classId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(classData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Class updated successfully.');
                    window.location.href = 'tutor-dashboard.html';
                } else {
                    alert(result.message || 'Error updating class. Please try again.');
                }
            } catch (error) {
                console.error('Error updating class:', error);
                alert('Error updating class. Please try again later.');
            }
        });
    }
});



document.addEventListener('DOMContentLoaded', function() {
    const tutorListElement = document.getElementById('tutorList');
    const searchBar = document.getElementById('searchBar');

    if (tutorListElement) {
        // Fetch list of tutors from the backend
        fetch('http://localhost:3000/api/class/tutors')
            .then(response => response.json())
            .then(data => {
                const tutors = data.tutors;
                displayTutors(tutors);

                // Add search functionality
                if (searchBar) {
                    searchBar.addEventListener('input', function() {
                        const searchTerm = searchBar.value.toLowerCase();
                        const filteredTutors = tutors.filter(tutor =>
                            `${tutor.firstName} ${tutor.lastName}`.toLowerCase().includes(searchTerm)
                        );
                        displayTutors(filteredTutors);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching tutors:', error);
                alert('Error fetching tutors. Please try again later.');
            });
    }

    function displayTutors(tutors) {
        tutorListElement.innerHTML = ''; // Clear the list
        tutors.forEach(tutor => {
            const tutorItem = document.createElement('div');
            tutorItem.classList.add('tutor-item');

            tutorItem.innerHTML = `
           
                <div class="tutor-info">
                <h3>${tutor.firstName} ${tutor.lastName}</h3>
                <p>${tutor.subjects ? tutor.subjects.join(', ') : 'N/A'}</p>

                <p><strong>Rating:</strong> ⭐ ${tutor.rating || 'N/A'}</p>
                <button class="btn-view-classes" data-tutor-id="${tutor._id}">View Classes</button>`;

            tutorListElement.appendChild(tutorItem);
        });

        // Add event listeners to "View Classes" buttons
        document.querySelectorAll('.btn-view-classes').forEach(button => {
            button.addEventListener('click', function() {
                const tutorId = this.getAttribute('data-tutor-id');
                window.location.href = `tutor-classes.html?tutorId=${tutorId}`;
            });
        });
    }
});


////Streak implement here
document.addEventListener('DOMContentLoaded', function() {
    const classListElement = document.getElementById('classList');
    const tutorNameElement = document.getElementById('tutorName');
    const classSearchBar = document.getElementById('classSearchBar');
    //const streakContainer = document.querySelector('.streaks-container span');
    const streakSections = document.querySelectorAll('.streak-section');

  

    if (classListElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const tutorId = urlParams.get('tutorId');

        if (!tutorId) {
            alert('Tutor not specified.');
            window.location.href = 'student-tutors.html';
            return;
        }

        // Fetch tutor's information
        fetch(`http://localhost:3000/api/user/${tutorId}`)
            .then(response => response.json())
            .then(data => {
                const tutor = data.user;
                tutorNameElement.textContent = `Classes by ${tutor.firstName} ${tutor.lastName}`;
            })
            .catch(error => {
                console.error('Error fetching tutor info:', error);
            });

        // Fetch classes by tutor
        fetch(`http://localhost:3000/api/class/tutor/${tutorId}/classes`)
    .then(response => response.json())
    .then(data => {
        let classes = data.classes;

        // Filter out past classes
        const now = new Date();
        classes = classes.filter(cls => {
            const classDateTime = getClassDateTime(cls.date, cls.startTime);
            return classDateTime >= now;
        });

        displayClasses(classes);

        // Add search functionality
        if (classSearchBar) {
            classSearchBar.addEventListener('input', function() {
                const searchTerm = classSearchBar.value.toLowerCase();
                const filteredClasses = classes.filter(cls =>
                    cls.title.toLowerCase().includes(searchTerm) ||
                    cls.subject.toLowerCase().includes(searchTerm)
                );
                displayClasses(filteredClasses);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching classes:', error);
        alert('Error fetching classes. Please try again later.');
    });
    }

    function getClassDateTime(classDateStr, startTimeStr) {
        const classDate = new Date(classDateStr);
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        classDate.setHours(hours, minutes, 0, 0);
        return classDate;
    }

    function displayClasses(classes) {
        classListElement.innerHTML = ''; // Clear the list
        classes.forEach(cls => {
            const classItem = document.createElement('div');
            classItem.classList.add('class-item');

            classItem.innerHTML = `
                <div class="class-info">
                    <h3>${cls.title}</h3>
                    <p>Subject: ${cls.subject}</p>
                    <p>Date: ${new Date(cls.date).toLocaleDateString()}</p>
                    <p>Time: ${cls.startTime} - ${cls.endTime}</p>
                    <p>Online: ${cls.isOnline ? 'Yes' : 'No'}</p>
                </div>
                <button class="btn-enroll" data-class-id="${cls._id}">Enroll</button>
            `;

            classListElement.appendChild(classItem);
        });

        // Add event listeners to "Enroll" buttons
        document.querySelectorAll('.btn-enroll').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                enrollInClass(classId);
            });
        });
    }
    let currentStreak = parseInt(localStorage.getItem('streak')) || 0;

    //Update the streak display
    const badgeElement = document.querySelector('.streak-section');
    function updateStreakDisplay() {
        streakContainer.textContent = `${currentStreak} Point Streak, Keep the streak going! 🌟`;
      
    }
    updateStreakDisplay();


    async function enrollInClass(classId) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You are not authenticated. Please log in.');
                window.location.href = 'SignIn.html';
                return;
            }

            const response = await fetch(`http://localhost:3000/api/class/enroll/${classId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                alert('Enrolled in class successfully.');
                // Optionally, update UI to reflect enrollment
                // Increment the streak
                currentStreak++;
                localStorage.setItem('streak', currentStreak);
                updateStreakDisplay();
            } else {
                alert(result.message || 'Error enrolling in class. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error enrolling in class. Please try again later.');
        }
    }
});

function generateCalendar(classes) {
    const calendarBody = document.getElementById('calendar-body');
    const monthYear = document.getElementById('month-year');
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function renderCalendar(month, year) {
        // Clear previous cells
        calendarBody.innerHTML = '';

        // Set month-year heading
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        monthYear.textContent = `${months[month]} ${year}`;

        // Get first day of the month
        const firstDay = new Date(year, month).getDay();

        // Number of days in month
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        let date = 1;

        // Create 6 rows for the calendar
        for (let i = 0; i < 6; i++) {
            let row = document.createElement('tr');

            // Create 7 columns for each day of the week
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement('td');

                if (i === 0 && j < firstDay) {
                    // Empty cells before the first day
                    cell.innerHTML = '';
                } else if (date > daysInMonth) {
                    // Stop creating cells after the last day
                    break;
                } else {
                    cell.innerHTML = date;

                    // Check if there's a class on this date
                    const classOnDate = classes.find(cls => {
                        const classDate = new Date(cls.date);
                        return classDate.getDate() === date &&
                            classDate.getMonth() === month &&
                            classDate.getFullYear() === year;
                    });

                    if (classOnDate) {
                        cell.classList.add('class-date');
                        cell.title = `${classOnDate.subject} - ${classOnDate.title}`;
                    }

                    date++;
                }

                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }
    }

    // Initial render
    renderCalendar(currentMonth, currentYear);

    // Event listeners for navigation buttons
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const classesContainer = document.getElementById('classesContainer');
    const mainProfilePic = document.getElementById('mainProfilePic1');

    const subjectImageMap = {
        'Mathematics': 'maths.png',
        'Life Science': 'ls.png',
        'Physical Science': 'phy.png',
        'Business Studies': 'bus.png',
        'English': 'eng.png',
        'Geography': 'geo.png',
        'Tourism': 'tour.png',
        'History': 'hist.png',
        // Add more subjects and their corresponding image filenames here
    };
    

    // Profile Picture Logic
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
        mainProfilePic.src = storedImage;
    }

    // Fetch and display classes
    if (classesContainer) {
        fetchTutorClasses();
    }

    async function fetchTutorClasses() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You are not authenticated. Please log in.');
                window.location.href = 'SignIn.html';
                return;
            }

            const response = await fetch('http://localhost:3000/api/class/my-classes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                const classes = result.classes;
                // Separate classes into upcoming and past
                const now = new Date();
                const upcomingClasses = [];
                const pastClasses = [];
                classes.forEach(cls => {
                    const classDate = new Date(cls.date);
                    if (classDate >= now) {
                        upcomingClasses.push(cls);
                    } else {
                        pastClasses.push(cls);
                    }
                });

                displayClasses(upcomingClasses);
                displayPastClasses(pastClasses);
                generateCalendar(upcomingClasses);
            } else {
                alert(result.message || 'Error fetching classes. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            alert('Error fetching classes. Please try again later.');
        }
    }

    function displayClasses(classes) {
    classesContainer.innerHTML = ''; // Clear existing content

    if (classes.length === 0) {
        classesContainer.innerHTML = '<p>No upcoming classes.</p>';
        return;
    }

    classes.forEach(cls => {
        console.log('Class object:', cls); // Log the class object
        console.log('Class ID:', cls._id);

        const classId = cls._id || cls.id;

        if (!classId) {
            console.error('Class ID is undefined for class:', cls);
            return;
        }

        const classItem = document.createElement('div');
        classItem.classList.add('class-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');
    
        // Get the image file name from the mapping
        const imageFileName = subjectImageMap[cls.subject] || 'default.png';
    
        classItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="src/${imageFileName}" alt="${cls.subject} Class" class="class-img">
                <div>
                    <p><strong>${cls.subject.toUpperCase()}</strong><br>${cls.title}</p>
                    <p>Date: ${new Date(cls.date).toLocaleDateString()}<br>Students: ${cls.studentsEnrolled.length}</p>
                </div>
            </div>
            <div class="d-flex">
                <button class="btn btn-primary btn-view-students mr-2" data-class-id="${classId}">View Students</button>
                <button class="btn btn-dark btn-edit-class mr-2" data-class-id="${classId}">Edit</button>
                <button class="btn btn-danger btn-cancel-class" data-class-id="${classId}">Cancel</button>
            </div>
        `;
    
        classesContainer.appendChild(classItem);
    });

        // Add event listeners
        document.querySelectorAll('.btn-view-students').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                window.location.href = `tutor-class-students.html?classId=${classId}`;
            });
        });

        // Add event listener to "Edit" buttons
        document.querySelectorAll('.btn-edit-class').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                console.log('Edit button clicked, classId:', classId);
                if (!classId) {
                    alert('Class ID not found.');
                    return;
                }
                window.location.href = `edit-class.html?classId=${classId}`;
            });
        });

        // Add event listener to "Cancel" buttons
        document.querySelectorAll('.btn-cancel-class').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                console.log('Cancel button clicked, classId:', classId);
                if (!classId) {
                    alert('Class ID not found.');
                    return;
                }
                deleteClass(classId);
            });
        });

    
    }

    async function deleteClass(classId) {
        try {
            const confirmDelete = confirm('Are you sure you want to cancel this class?');
            if (!confirmDelete) return;

            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You are not authenticated. Please log in.');
                window.location.href = 'SignIn.html';
                return;
            }

            const response = await fetch(`http://localhost:3000/api/class/${classId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                alert('Class cancelled successfully.');
                // Refresh the class list
                fetchTutorClasses();
            } else {
                alert(result.message || 'Error cancelling class. Please try again.');
            }
        } catch (error) {
            console.error('Error cancelling class:', error);
            alert('Error cancelling class. Please try again later.');
        }
    }

    function displayPastClasses(classes) {
        pastClassesContainer.innerHTML = ''; // Clear existing content
    
        if (classes.length === 0) {
            pastClassesContainer.innerHTML = '<p>No past classes.</p>';
            return;
        }
    
        classes.forEach(cls => {
            const classId = cls._id || cls.id;
    
            if (!classId) {
                console.error('Class ID is undefined for class:', cls);
                return;
            }
    
            const classItem = document.createElement('div');
            classItem.classList.add('class-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');
    
            // Get the image file name from the mapping
            const imageFileName = subjectImageMap[cls.subject] || 'default.png';
    
            classItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="src/${imageFileName}" alt="${cls.subject} Class" class="class-img">
                    <div>
                        <p><strong>${cls.subject.toUpperCase()}</strong><br>${cls.title}</p>
                        <p>Date: ${new Date(cls.date).toLocaleDateString()}<br>Students: ${cls.studentsEnrolled.length}</p>
                    </div>
                </div>
                <div class="d-flex">
                    <button class="btn btn-primary btn-view-students mr-2" data-class-id="${classId}">View Students</button>
                    <!-- Optionally, you can include a button to view class details -->
                </div>
            `;
    
            pastClassesContainer.appendChild(classItem);
        });
    
        // Add event listeners
        document.querySelectorAll('.btn-view-students').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                window.location.href = `tutor-class-students.html?classId=${classId}`;
            });
        });
    }
    

    // Fetch and display classes on page load
    fetchTutorClasses();
});

document.addEventListener('DOMContentLoaded', function() {
    const studentsContainer = document.getElementById('studentsContainer');
    const classTitleElement = document.getElementById('classTitle');

    if (studentsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const classId = urlParams.get('classId');

        if (!classId) {
            alert('Class ID not specified.');
            window.location.href = 'tutor-dashboard.html';
            return;
        }

        fetchEnrolledStudents(classId);
    }

    async function fetchEnrolledStudents(classId) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You are not authenticated. Please log in.');
                window.location.href = 'SignIn.html';
                return;
            }

            const response = await fetch(`http://localhost:3000/api/class/class/${classId}/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                const students = result.students;
                displayStudents(students);
            } else {
                alert(result.message || 'Error fetching students. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            alert('Error fetching students. Please try again later.');
        }
    }

    function displayStudents(students) {
        studentsContainer.innerHTML = ''; // Clear existing content

        if (students.length === 0) {
            studentsContainer.innerHTML = '<p>No students enrolled in this class.</p>';
            return;
        }

        const list = document.createElement('ul');
        students.forEach(student => {
            const listItem = document.createElement('li');
            listItem.textContent = `${student.firstName} ${student.lastName} (${student.email})`;
            list.appendChild(listItem);
        });

        studentsContainer.appendChild(list);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const classesContainer = document.getElementById('classesContainerStudent');
    const mainProfilePic = document.getElementById('mainProfilePic');

    const subjectImageMap = {
        'Mathematics': 'maths.png',
        'Life Science': 'ls.png',
        'Physical Science': 'phy.png',
        'Business Studies': 'bus.png',
        'English': 'eng.png',
        'Geography': 'geo.png',
        'Tourism': 'tour.png',
        'History': 'hist.png',
        // Add more subjects and their corresponding image filenames here
    };

    // Profile Picture Logic
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
        mainProfilePic.src = storedImage;
    }

    // Fetch and display enrolled classes
    if (classesContainer) {
        fetchEnrolledClasses();
    }

    async function fetchEnrolledClasses() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You are not authenticated. Please log in.');
                window.location.href = 'SignIn.html';
                return;
            }
    
            const response = await fetch('http://localhost:3000/api/class/enrolled-classes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const result = await response.json();
    
            if (response.ok) {
                let classes = result.classes;
    
                // Filter out past classes
                const now = new Date();
                classes = classes.filter(cls => {
                    // Combine class date and start time
                    const classDateTime = getClassDateTime(cls.date, cls.startTime);
                    return classDateTime >= now;
                });
    
                displayClasses(classes);
                generateCalendar(classes);
            } else {
                alert(result.message || 'Error fetching classes. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching enrolled classes:', error);
            alert('Error fetching classes. Please try again later.');
        }
    }

    function getClassDateTime(classDateStr, startTimeStr) {
        const classDate = new Date(classDateStr);
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        classDate.setHours(hours, minutes, 0, 0);
        return classDate;
    }
    
    function generateCalendar(classes) {
        const calendarBody = document.getElementById('calendar-body');
        const monthYear = document.getElementById('month-year');
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
    
        function renderCalendar(month, year) {
            // Clear previous cells
            calendarBody.innerHTML = '';
    
            // Set month-year heading
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            monthYear.textContent = `${months[month]} ${year}`;
    
            // Get first day of the month
            const firstDay = new Date(year, month).getDay();
    
            // Number of days in month
            const daysInMonth = 32 - new Date(year, month, 32).getDate();
    
            let date = 1;
    
            // Create 6 rows for the calendar
            for (let i = 0; i < 6; i++) {
                let row = document.createElement('tr');
    
                // Create 7 columns for each day of the week
                for (let j = 0; j < 7; j++) {
                    let cell = document.createElement('td');
                    cell.classList.add('text-center', 'align-middle');
                    cell.style.height = '80px';
                    cell.style.verticalAlign = 'middle';
    
                    if (i === 0 && j < firstDay) {
                        // Empty cells before the first day
                        cell.innerHTML = '';
                    } else if (date > daysInMonth) {
                        // Stop creating cells after the last day
                        break;
                    } else {
                        cell.innerHTML = `<span>${date}</span>`;
    
                        // Check if there's a class on this date
                        const classesOnDate = classes.filter(cls => {
                            const classDateTime = getClassDateTime(cls.date, cls.startTime);
                            return classDateTime.getDate() === date &&
                                classDateTime.getMonth() === month &&
                                classDateTime.getFullYear() === year;
                        });
    
                        if (classesOnDate.length > 0) {
                            cell.classList.add('class-date');
                            cell.title = classesOnDate.map(cls => `${cls.subject} - ${cls.title}`).join('\n');
    
                            // Add click event to show class details
                            cell.addEventListener('click', function() {
                                const classDetails = classesOnDate.map(cls =>
                                    `Subject: ${cls.subject}\nTitle: ${cls.title}\nDate: ${new Date(cls.date).toLocaleDateString()} ${cls.startTime}`
                                ).join('\n\n');
                                alert(`Classes on ${date}/${month + 1}/${year}:\n\n${classDetails}`);
                            });
                        }
    
                        date++;
                    }
    
                    row.appendChild(cell);
                }
    
                calendarBody.appendChild(row);
            }
        }
    
        // Initial render
        renderCalendar(currentMonth, currentYear);
    
        // Event listeners for navigation buttons
        document.getElementById('prev-month').addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });
    
        document.getElementById('next-month').addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }
    

    function displayClasses(classes) {
        classesContainer.innerHTML = ''; // Clear existing content
    
        if (classes.length === 0) {
            classesContainer.innerHTML = '<p>No upcoming classes.</p>';
            return;
        }
    
        classes.forEach(cls => {
            const classItem = document.createElement('div');
            classItem.classList.add('class-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');
    
            // Calculate time until class starts
            const classDateTime = getClassDateTime(cls.date, cls.startTime);
            const now = new Date();
            let timeUntilClass = '';
    
            const diffMs = classDateTime - now;
            const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
            const diffHours = Math.floor((diffMs / (60 * 60 * 1000)) % 24);
            const diffMinutes = Math.floor((diffMs / (60 * 1000)) % 60);
    
            if (diffDays > 0) {
                timeUntilClass = `In ${diffDays} day(s)`;
            } else if (diffHours > 0) {
                timeUntilClass = `In ${diffHours} hour(s)`;
            } else if (diffMinutes > 0) {
                timeUntilClass = `In ${diffMinutes} minute(s)`;
            } else {
                timeUntilClass = 'Starting soon';
            }
    
            const imageFileName = subjectImageMap[cls.subject] || 'default.png';
    
            classItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="src/${imageFileName}" alt="${cls.subject}" class="class-img">
                    <div>
                        <p><strong>${cls.subject.toUpperCase()}</strong><br>${cls.title}</p>
                        <p>${timeUntilClass}</p>
                    </div>
                </div>
                <button class="btn btn-secondary btn-attend" data-class-id="${cls._id}">Attend</button>
            `;
    
            classesContainer.appendChild(classItem);
        });
    
        // Add event listeners to "Attend" buttons
        document.querySelectorAll('.btn-attend').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                // Implement the logic to attend the class
                alert(`Attending class with ID: ${classId}`);
                // Redirect or open the class link if available
            });
        });
    }
    
});
  

// calander 
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const monthYearDisplay = document.getElementById('month-year');
const calendarBody = document.getElementById('calendar-body');

let currentDate = new Date();

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    // Clear previous calendar
    calendarBody.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let row = document.createElement('tr');

    // Create empty cells for days of the previous month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }

    // Fill in the days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }

        const cell = document.createElement('td');
        cell.textContent = day;

        // Highlight the current day
        const isToday = day === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear();
        if (isToday) {
            cell.classList.add('current-day');
        }

        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Initialize the calendar with the current date
renderCalendar(currentDate);




    

    
    