document.addEventListener('DOMContentLoaded', function() {
    const classListElement = document.getElementById('classList');
    const tutorNameElement = document.getElementById('tutorName');
    const classSearchBar = document.getElementById('classSearchBar');

    if (classListElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const tutorId = urlParams.get('tutorId');

        if (!tutorId) {
            alert('Tutor not specified.');
            window.location.href = 'student-tutors.html';
            return;
        }

        // Fetch tutor's information
        fetch(`/api/user/${tutorId}`)
            .then(response => response.json())
            .then(data => {
                const tutor = data.user;
                tutorNameElement.textContent = `Classes by ${tutor.firstName} ${tutor.lastName}`;
            })
            .catch(error => {
                console.error('Error fetching tutor info:', error);
            });

        // Fetch classes by tutor
        fetch(`/api/class/tutor/${tutorId}/classes`)
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

    async function enrollInClass(classId) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You are not authenticated. Please log in.');
                window.location.href = 'SignIn.html';
                return;
            }

            const response = await fetch(`/api/class/enroll/${classId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                alert('Enrolled in class successfully.');
            } else {
                alert(result.message || 'Error enrolling in class. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error enrolling in class. Please try again later.');
        }
    }
});
