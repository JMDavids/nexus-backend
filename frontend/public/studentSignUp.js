document.addEventListener('DOMContentLoaded', function() {
    // Create Account Form Submission
    const createAccountForm = document.querySelector('#studentSignUpForm');
    if (createAccountForm) {
      createAccountForm.addEventListener('submit', async function(event) {
        event.preventDefault();
  
        // Get form values
        const username = createAccountForm.querySelector('input[placeholder="Username"]').value;
        const firstName = createAccountForm.querySelector('input[placeholder="First Name"]').value;
        const lastName = createAccountForm.querySelector('input[placeholder="Last Name"]').value;
        const email = createAccountForm.querySelector('input[placeholder="E-mail"]').value;
        const password = createAccountForm.querySelector('input[placeholder="Password"]').value;
        const termsAccepted = createAccountForm.querySelector('#termsCheck').checked;
  
  
        // Validate form fields
        if (username && firstName && lastName && email && password && termsAccepted) {
          // Data to be sent to the backend
          const userData = {
            username,
            firstName,
            lastName,
            email,
            password,
            role: "student",
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
              window.location.href = 'Student-Sign-in.html';  // Redirect to sign-in page
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
  });
  