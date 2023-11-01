// 使用axios进行注册
function register() {
  const username = document.querySelector('input[name="username"]').value;
  const password = document.querySelector('input[name="password1"]').value;
  const password2 = document.querySelector('input[name="password2"]').value;
  if (password !== password2) {
    alert('两次输入的密码不一致！');
    return;
  }
  axios.post('http://localhost:3000/api/register', {
    username: username,
    password: password
  })
  .then(response => {
    if (response.data.success) {
      window.location.href = 'index.html';
    } else {
      alert('用户已存在！');
    }
  })
  .catch(error => {
    console.error('Error registering:', error);
  });
}

// 使用axios进行登录
function login() {
  const enteredUsername = document.querySelector('input[type="text"]').value;
  const enteredPassword = document.querySelector('input[type="password"]').value;

  axios.post('http://localhost:3000/api/login', {
    username: enteredUsername,
    password: enteredPassword
  })
  .then(response => {
    if (response.data.success) {
      // Redirect to dashboard or main page
      window.location.href = 'geo-main/geoguess.html';
    } else {
      alert(response.data.error);
    }
  })
  .catch(error => {
    console.error('Error logging in:', error);
  });
}
