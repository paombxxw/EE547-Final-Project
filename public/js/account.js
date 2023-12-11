// 更改密码表单提交处理
document.getElementById('change-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    // fetch 调用 ...
    fetch('/try-change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ newPassword }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Password change successful');
        alert('Password changed successfully');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to change password.');
    });
});

// 删除账户按钮点击处理
document.getElementById('try-delete-account').addEventListener('click', function() {
    fetch('/try-delete-account', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Account deleted successfully');
        alert('Account deleted');
        localStorage.removeItem('token'); // 清除本地存储的令牌
        window.location.href = '/try-login.html'; // 跳转到登录页面
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to delete account.');
    });
});
