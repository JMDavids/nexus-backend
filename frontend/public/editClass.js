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

                const response = await fetch(`/api/class/${classId}`, {
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

                const response = await fetch(`/api/class/${classId}`, {
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