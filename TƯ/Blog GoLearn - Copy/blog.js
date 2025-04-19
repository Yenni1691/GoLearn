document.addEventListener("DOMContentLoaded", function () {
    // ======== SLIDESHOW AUTO =========
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll(".go-slide");
  
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === index) slide.classList.add("active");
      });
    }
  
    function nextSlide() {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      showSlide(currentSlideIndex);
    }
  
    function prevSlide() {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      showSlide(currentSlideIndex);
    }
  
    // Tự động chuyển slide mỗi 4 giây
    setInterval(nextSlide, 4000);
  
    // Hiển thị slide đầu tiên ban đầu
    showSlide(currentSlideIndex);
  
    // ======== DROPDOWN =========
    window.toggleDropdown = function () {
      const dropdown = document.getElementById("dropdown");
      dropdown.classList.toggle("show");
    };
  
    // ======== TÌM KIẾM =========
    window.handleSearch = function () {
      const keyword = document.getElementById("searchInput").value.toLowerCase();
      const posts = document.querySelectorAll(".tin-bai");
      let count = 0;
  
      posts.forEach(post => {
        const text = post.innerText.toLowerCase();
        const visible = text.includes(keyword);
        post.style.display = visible ? "flex" : "none";
        if (visible) count++;
      });
  
      alert(`${count} kết quả tìm kiếm cho "${keyword}".`);
    };
  
    window.handleKeyPress = function (event) {
      if (event.key === "Enter") {
        handleSearch();
      }
    };
  
    // ======== THÔNG BÁO =========
    window.setNotificationCount = function (count) {
      const badge = document.getElementById("notification-count");
      badge.innerText = count;
      badge.style.display = count > 0 ? "inline-block" : "none";
    };
  
    // Gọi khởi tạo
    setNotificationCount(3);
  });
  