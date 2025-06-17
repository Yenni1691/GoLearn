document.addEventListener('DOMContentLoaded', () => {
    const coursesGrid = document.getElementById('courses-grid');
    const courseCount = document.getElementById('course-count');

    if (!coursesGrid || !courseCount) {
        console.error('Required elements not found: courses-grid or course-count');
        return;
    }

    // Load courses from localStorage
    let courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Update course count
    courseCount.textContent = courses.length;

    // Display a message if no courses are found
    if (courses.length === 0) {
        coursesGrid.innerHTML = '<p>Chưa có khóa học nào. Hãy tạo một khóa học mới!</p>';
        return;
    }

    // Display each course with image, title, subject, and class
    courses.forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <img src="${course.image}" alt="${course.title}">
            <div class="course-info">
                <div class="course-title">${course.title}</div>
                <div class="course-details">Môn học: ${course.category}</div>
                <div class="course-details">Lớp học: ${course.courseClass}</div>
            </div>
            <div class="course-card-menu">⋮
                <div class="course-card-menu-content">
                    <a href="upload.html?edit=${index}" data-action="edit" data-index="${index}">Sửa</a>
                    <a href="#" data-action="delete" data-index="${index}">Xóa</a>
                </div>
            </div>
        `;
        coursesGrid.appendChild(courseCard);

        // Add click event to redirect to course-details.html (except when clicking the menu)
        courseCard.addEventListener('click', (e) => {
            // Prevent redirection if clicking the menu or its content
            if (e.target.closest('.course-card-menu') || e.target.closest('.course-card-menu-content')) {
                return;
            }
            window.location.href = `course-details.html?view=${index}`;
        });

        // Toggle menu visibility
        const menuButton = courseCard.querySelector('.course-card-menu');
        const menuContent = courseCard.querySelector('.course-card-menu-content');
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click from triggering
            menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
        });

        // Handle menu actions
        menuContent.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click from triggering
                const action = link.getAttribute('data-action');
                const index = parseInt(link.getAttribute('data-index'));

                if (action === 'delete') {
                    e.preventDefault();
                    courses.splice(index, 1);
                    localStorage.setItem('courses', JSON.stringify(courses));
                    courseCard.remove();
                    courseCount.textContent = courses.length;
                    if (courses.length === 0) {
                        coursesGrid.innerHTML = '<p>Chưa có khóa học nào. Hãy tạo một khóa học mới!</p>';
                    }
                }
                // For edit, let the href handle navigation
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !menuContent.contains(e.target)) {
                menuContent.style.display = 'none';
            }
        });
    });
});