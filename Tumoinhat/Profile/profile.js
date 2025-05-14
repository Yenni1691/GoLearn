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

// Xử lý lưu hồ sơ người dùng
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#editProfileForm form");
  const avatarInput = document.getElementById("avatar");
  const nameInput = document.getElementById("name");
  const bioInput = document.getElementById("bio");
  const contactInput = document.getElementById("contact");
  const linksInput = document.getElementById("links");

  // Load từ localStorage nếu có
  const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
  if (savedProfile) {
    updateProfileDisplay(savedProfile);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn reload

    // Xử lý ảnh đại diện
    const avatarFile = avatarInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const avatarUrl = e.target.result;

      const profileData = {
        avatar: avatarUrl,
        name: nameInput.value.trim(),
        bio: bioInput.value.trim(),
        contact: contactInput.value.trim(),
        links: linksInput.value.trim(),
      };

      // Hiển thị dữ liệu vừa nhập
      updateProfileDisplay(profileData);

      // Lưu tạm vào localStorage
      localStorage.setItem("userProfile", JSON.stringify(profileData));

      toggleEditForm(); // Ẩn form sau khi lưu
    };

    if (avatarFile) {
      reader.readAsDataURL(avatarFile); // Nếu có ảnh mới
    } else {
      // Không thay ảnh: dùng ảnh hiện tại
      const currentAvatar = document.getElementById("profileAvatar").src;
      const profileData = {
        avatar: currentAvatar,
        name: nameInput.value.trim(),
        bio: bioInput.value.trim(),
        contact: contactInput.value.trim(),
        links: linksInput.value.trim(),
      };

      updateProfileDisplay(profileData);
      localStorage.setItem("userProfile", JSON.stringify(profileData));
      toggleEditForm();
    }
  });
});

// Cập nhật giao diện hồ sơ
function updateProfileDisplay(data) {
  const avatar = document.getElementById("profileAvatar");
  const name = document.querySelector(".golearn-profile-name");
  const bio = document.getElementById("displayBio");
  const contact = document.getElementById("displayContact");
  const links = document.getElementById("displayLinks");

  if (avatar && data.avatar) avatar.src = data.avatar;
  if (name && data.name) name.textContent = data.name;
  if (bio && data.bio) bio.textContent = data.bio;
  if (contact && data.contact) contact.textContent = data.contact;
  if (links && data.links) links.textContent = data.links;
}
