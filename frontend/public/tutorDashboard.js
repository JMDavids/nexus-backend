document.addEventListener('DOMContentLoaded', function() {
    const classesContainer = document.getElementById('classesContainer');
    const pastClassesContainer = document.getElementById('pastClassesContainer');
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

    if (classesContainer || pastClassesContainer) {
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
    
            const response = await fetch('/api/class/my-classes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const result = await response.json();
    
            if (response.ok) {
                const classes = result.classes;
    
                // Use the separateAndDisplayClasses function
                separateAndDisplayClasses(classes);
            } else {
                alert(result.message || 'Error fetching classes. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            alert('Error fetching classes. Please try again later.');
        }
    }

    function separateAndDisplayClasses(classes) {
        const now = new Date();
        const upcomingClasses = [];
        const pastClasses = [];

        classes.forEach(cls => {
            const classDateTime = getClassDateTime(cls.date, cls.startTime);
            if (classDateTime >= now) {
                upcomingClasses.push(cls);
            } else {
                pastClasses.push(cls);
            }
        });

        displayUpcomingClasses(upcomingClasses);
        displayPastClasses(pastClasses);
        generateCalendar(classes); // Pass all classes to the calendar
    }

    function getClassDateTime(classDateStr, startTimeStr) {
        const classDate = new Date(classDateStr);
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        classDate.setHours(hours, minutes, 0, 0);
        return classDate;
    }  

    function displayUpcomingClasses(classes) {
        if (!classesContainer) return;
    
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
    
            // Get the image filename based on the subject
            const imageFileName = subjectImageMap[cls.subject] || 'default.png';
    
            classItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="src/${imageFileName}" alt="${cls.subject}" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div>
                        <p><strong>${cls.subject.toUpperCase()}</strong><br>${cls.title}</p>
                        <p>${timeUntilClass}</p>
                    </div>
                </div>
                <div class="buttons">
                    <button class="btn btn-danger btn-viewstudents" data-class-id="${cls._id}">View Students</button>
                    <button class="btn btn-primary btn-edit" data-class-id="${cls._id}">Edit</button>
                    <button class="btn btn-warning btn-cancel" data-class-id="${cls._id}">Cancel</button>
                </div>
            `;
    
            classesContainer.appendChild(classItem);
        });
    
        // Add event listeners to buttons
        classesContainer.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                editClass(classId);
            });
        });
    
        classesContainer.querySelectorAll('.btn-cancel').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                deleteClass(classId);
            });
        });
    
        classesContainer.querySelectorAll('.btn-viewstudents').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                viewEnrolledtudents(classId);
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

            const response = await fetch(`/api/class/${classId}`, {
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

    function editClass(classId) {
        window.location.href = `edit-class.html?classId=${classId}`;
    }

    function viewEnrolledtudents(classId) {
        window.location.href = `tutor-class-students.html?classId=${classId}`;
    }

    function displayPastClasses(classes) {
        if (!pastClassesContainer) return;
    
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
                    <img src="src/${imageFileName}" alt="${cls.subject} Class" class="class-img" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div>
                        <p><strong>${cls.subject.toUpperCase()}</strong><br>${cls.title}</p>
                        <p>Date: ${new Date(cls.date).toLocaleDateString()}<br>Students: ${cls.studentsEnrolled.length}</p>
                    </div>
                </div>
                <div>
                    <button class="btn btn-primary btn-view-students" data-class-id="${classId}">View Students</button>
                </div>
            `;
    
            pastClassesContainer.appendChild(classItem);
        });
    
        // Add event listeners
        pastClassesContainer.querySelectorAll('.btn-view-students').forEach(button => {
            button.addEventListener('click', function() {
                const classId = this.getAttribute('data-class-id');
                window.location.href = `tutor-class-students.html?classId=${classId}`;
            });
        });
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
                        const cellDate = new Date(year, month, date);
                        const classesOnDate = classes.filter(cls => {
                            const classDateTime = getClassDateTime(cls.date, cls.startTime);
                            return classDateTime.getDate() === cellDate.getDate() &&
                                classDateTime.getMonth() === cellDate.getMonth() &&
                                classDateTime.getFullYear() === cellDate.getFullYear();
                        });
    
                        if (classesOnDate.length > 0) {
                            cell.classList.add('class-date');
                            cell.title = classesOnDate.map(cls => `${cls.subject} - ${cls.title}`).join('\n');
    
                            // Add click event to show class details
                            cell.addEventListener('click', function() {
                                const classDetails = classesOnDate.map(cls =>
                                    `Subject: ${cls.subject}
    Title: ${cls.title}
    Date: ${new Date(cls.date).toLocaleDateString()}
    Time: ${cls.startTime} - ${cls.endTime}
    Online: ${cls.isOnline ? 'Yes' : 'No'}`
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

            const response = await fetch(`/api/class/class/${classId}/students`, {
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
