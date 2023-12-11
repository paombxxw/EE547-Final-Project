
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('try-register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        fetch('/try-register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                alert('Registration failed: ' + data.error);
            } else {
                console.log('Success:', data);
                alert('Registration successful!');
                window.location.href = '/login'; 
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Registration failed.');
        });
    });


    document.getElementById('try-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        console.log('Submitting login form', { username, password }); 

        fetch('/try-login', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            console.log('Received response', response);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Login failed');
            }
        })
        .then(data => {
            console.log('Response data', data);
            console.log('Success:', data.message);
            
            localStorage.setItem('token', data.token);
            window.location.href = '/try-account'; // 跳转到账户页面
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message);
        });
    });
});


    