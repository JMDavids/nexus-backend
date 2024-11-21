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