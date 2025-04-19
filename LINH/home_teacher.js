// Đổi tên giáo viên
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

// Slideshow
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
// Tự động chuyển slide sau mỗi 3 giây (3000ms)
setInterval(() => {
    plusSlides(1);
  }, 5000); // 
  
