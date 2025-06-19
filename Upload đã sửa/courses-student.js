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
        coursesGrid.innerHTML = '<p>Chưa có khóa học nào.</p>';
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
        `;
        coursesGrid.appendChild(courseCard);

        // Add click event to redirect to course-details.html
        courseCard.addEventListener('click', () => {
            window.location.href = `course-details-student.html?view=${index}`;
        });
    });
});