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

// Cập nhật số lượng thông báo
function updateNotificationCount(count) {
  const badge = document.getElementById("notification-count");
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline" : "none";
}

// Đổi tên học sinh
function changeStudentName(name) {
  const studentName = document.getElementById("student-name");
  if (studentName) {
    studentName.textContent = name;
  }
}

// Ví dụ gọi hàm sau khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", function () {
  updateNotificationCount(5); // ví dụ: có 5 thông báo
  changeStudentName("Nguyễn Văn A"); // ví dụ: tên học sinh
});

// edit profile form
function toggleEditForm() {
  const form = document.getElementById("editProfileForm");
  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "block";
    form.scrollIntoView({ behavior: "smooth" });
  } else {
    form.style.display = "none";
  }
}
