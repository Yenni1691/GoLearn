let selectedRole = "";

function selectRole(role) {
  selectedRole = role;

  // Ẩn phần chọn vai trò, hiện form đăng nhập
  document.getElementById('role-selection').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';

  // Cập nhật tiêu đề
  const title = role === 'teacher' ? "Đăng nhập - Giáo viên" : "Đăng nhập - Học sinh";
  document.getElementById('login-title').innerText = title;

  // Cập nhật màu nút đăng nhập theo vai trò
  const loginBtn = document.getElementById('login-btn');
  if (role === 'teacher') {
    loginBtn.style.backgroundColor = '#FF99CC';
  } else {
    loginBtn.style.backgroundColor = '#009966';
  }
}

function login() {
  const username = document.getElementById('login-identifier').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (username === "" || password === "") {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (selectedRole === 'teacher') {
    alert("Giáo viên đăng nhập thành công!");
    window.location.href = '/dashboard/teacher';
  } else {
    alert("Học sinh đăng nhập thành công!");
    window.location.href = '/dashboard/student';
  }
}
