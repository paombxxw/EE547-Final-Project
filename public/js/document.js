document.addEventListener('DOMContentLoaded', () => {

    //for register
    // document.getElementById('registerForm').addEventListener('submit', function(event) {

    //     event.preventDefault();
    //     const formData = new FormData(this);
    //     const plainFormData = Object.fromEntries(formData);
    //     const formDataJsonString = JSON.stringify(plainFormData);
    
    //     fetch('/register-account', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: formDataJsonString
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.user) {
    //             document.getElementById('successMessage').innerHTML = `Hi ${data.user.username}! Nice to meet you!`;
    //             document.getElementById('successMessage').style.display = 'block';
    //             setTimeout(() => {
    //                 window.location.href = '/';
    //             }, 2000);
    //         } else if (data.error) {
    //             // Handle the error from the server and display it to the user
    //             const registerErrorMessage = document.getElementById('registerErrorMessage'); // You should have an element with this id to display registration errors
    //             registerErrorMessage.textContent = data.error;
    //             registerErrorMessage.style.display = 'block';
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         alert(error.message);
    //     });
    // });
    
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);
    
        fetch('/register-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formDataJsonString
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                // 注册成功，现在确认是否登录
                fetch('/check-login')
                    .then(response => response.json())
                    .then(loginData => {
                        if (loginData.isLoggedIn) {
                            // 更新 UI 以显示登录状态
                            document.getElementById('user-guest').style.display = 'none';
                            document.getElementById('user-logged-in').textContent = `Hello, ${data.user.username}`;
                            document.getElementById('user-logged-in').style.display = 'block';
                        }
                    });
                
                document.getElementById('successMessage').innerHTML = `Hi ${data.user.username}! Nice to meet you!`;
                document.getElementById('successMessage').style.display = 'block';
                setTimeout(() => window.location.href = '/', 2000);
            } else if (data.error) {
                const registerErrorMessage = document.getElementById('registerErrorMessage');
                registerErrorMessage.textContent = data.error;
                registerErrorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
    });
    
    
    //for login
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);
    
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formDataJsonString
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('username').textContent = data.user.username; // Update username display
                document.getElementById('successMessage').style.display = 'block';
                setTimeout(() => window.location.href = '/', 2000);
            } else {
                const loginErrorMessage = document.getElementById('loginErrorMessage');
                loginErrorMessage.textContent = data.error;
                loginErrorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login. Please try again.');
        });
    });
    

    //if the user is logged in, show the secret link
    const loggedIn = document.cookie.split(';').some((item) => item.trim().startsWith('loggedIn='));
    if (loggedIn) {
        document.getElementById('secretLink').style.display = 'block';
    }
    
});
