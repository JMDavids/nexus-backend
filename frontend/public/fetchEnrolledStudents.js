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