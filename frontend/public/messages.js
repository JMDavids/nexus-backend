document.addEventListener('DOMContentLoaded', function () {
    const classDropdown = document.getElementById('classDropdown');
    const messageForm = document.querySelector('form');

    // Fetch the tutor's classes and populate the dropdown
    fetchTutorClasses();

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
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          const classes = result.classes;
          populateClassDropdown(classes);
        } else {
          alert(result.message || 'Error fetching classes. Please try again.');
        }
      } catch (error) {
        //console.error('Error fetching classes:', error);
        //alert('Error fetching classes. Please try again later.');
      }
    }

    function populateClassDropdown(classes) {
      classes.forEach((cls) => {
        const option = document.createElement('option');
        option.value = cls._id;
        option.textContent = `${cls.subject}: ${cls.title}`;
        classDropdown.appendChild(option);
      });
    }

    // Handle form submission
    messageForm.addEventListener('submit', sendMessage);

    async function sendMessage(event) {
      event.preventDefault();

      const classId = classDropdown.value;
      const content = document.getElementById('message').value.trim();

      if (!classId || !content) {
        alert('Please select a class and enter a message.');
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          alert('You are not authenticated. Please log in.');
          window.location.href = 'SignIn.html';
          return;
        }

        const response = await fetch('http://localhost:3000/api/messages/broadcast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ classId, content }),
        });

        const result = await response.json();

        if (response.ok) {
          alert('Message sent successfully!');
          // Optionally, reset the form
          messageForm.reset();
        } else {
          alert(result.message || 'Error sending message. Please try again.');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message. Please try again later.');
      }
    }

    function cancel() {
      messageForm.reset();
    }

    // Assign the cancel function to the cancel button
    document.querySelector('button[type="button"]').addEventListener('click', cancel);
  });