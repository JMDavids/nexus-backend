document.addEventListener('DOMContentLoaded', function() {
    const createClassForm = document.getElementById('createClassForm');
    if (createClassForm) {
        createClassForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
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

                const response = await fetch('/api/class/create', {
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