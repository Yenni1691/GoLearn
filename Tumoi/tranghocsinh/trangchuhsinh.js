function toggleDropdown() {
    const avatarMenu = document.querySelector('.avatar-menu');
    avatarMenu.classList.toggle('show');
  }
  
  document.addEventListener('click', function (event) {
    const avatarMenu = document.querySelector('.avatar-menu');
    if (!avatarMenu.contains(event.target)) {
      avatarMenu.classList.remove('show');
    }
  });
  // Toggle dropdown menu
  function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("show");
  }
  
// Đổi tên học sinh
function changeTeacherName(name) {
  const teacherName = document.getElementById("teacher-name");
  if (teacherName) {
    teacherName.textContent = name;
    console.log("Teacher name updated to:", teacherName.textContent); // Debug log
  } else {
    console.log("Element with id 'teacher-name' not found");
  }
}
// Đổi số lượng thông báo
function updateNotificationCount(count) {
  const badge = document.getElementById("notification-count");
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline" : "none";
}

// Ví dụ gọi hàm sau khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", function () {
  updateNotificationCount(5); // Ví dụ: Có 5 thông báo
  changeTeacherName("Nguyễn Văn A"); // Ví dụ: Tên giáo viên
});

// Ví dụ gọi hàm sau khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", function () {
  updateNotificationCount(5); // ví dụ: có 5 thông báo
  changeStudentName("Nguyễn Văn A"); // ví dụ: tên học sinh
});

  