document.addEventListener('DOMContentLoaded', () => {
    const courseSelect = document.getElementById('courseSelect');
    const completionRate = document.getElementById('completionRate');
    const viewCounts = document.getElementById('viewCounts');
    const incompleteModules = document.getElementById('incompleteModules');
    const completionTimes = document.getElementById('completionTimes');
    const assignmentScores = document.getElementById('assignmentScores');

    // Mock student ID
    const studentId = 1;

    // Load courses from localStorage
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Populate course select dropdown
    courses.forEach((course, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = course.title || `Khóa học ${index + 1}`;
        courseSelect.appendChild(option);
    });

    // Handle course selection
    courseSelect.addEventListener('change', () => {
        const courseIndex = parseInt(courseSelect.value);
        if (isNaN(courseIndex)) {
            completionRate.textContent = '0%';
            viewCounts.innerHTML = '<li>Vui lòng chọn khóa học.</li>';
            incompleteModules.innerHTML = '<li>Vui lòng chọn khóa học.</li>';
            completionTimes.innerHTML = '<li>Vui lòng chọn khóa học.</li>';
            assignmentScores.innerHTML = '<li>Vui lòng chọn khóa học.</li>';
            return;
        }

        const course = courses[courseIndex];
        const progress = JSON.parse(localStorage.getItem(`courseProgress_${course.id}_${studentId}`)) || {};
        const viewCountsData = JSON.parse(localStorage.getItem(`viewCounts_${course.id}_${studentId}`)) || {};
        const completionTimesData = JSON.parse(localStorage.getItem(`completionTimes_${course.id}_${studentId}`)) || {};
        const assignmentResults = JSON.parse(localStorage.getItem(`assignmentResults_${course.id}_${studentId}`)) || {};

        // Calculate completion rate
        let totalLessons = 0;
        let completedLessons = 0;
        course.modules.forEach((module, moduleIndex) => {
            if (module.lessonFiles) {
                totalLessons += module.lessonFiles.length;
                if (progress[moduleIndex]) {
                    completedLessons += Object.values(progress[moduleIndex]).filter(v => v).length;
                }
            }
        });
        const completionPercentage = totalLessons > 0 ? ((completedLessons / totalLessons) * 100).toFixed(2) : 0;
        completionRate.textContent = `${completionPercentage}%`;

        // Display view counts
        viewCounts.innerHTML = '';
        course.modules.forEach((module, moduleIndex) => {
            if (module.lessonFiles && viewCountsData[moduleIndex]) {
                module.lessonFiles.forEach((file, lessonIndex) => {
                    const count = viewCountsData[moduleIndex][lessonIndex] || 0;
                    const li = document.createElement('li');
                    li.textContent = `Module ${moduleIndex + 1}, Bài học: ${file.name} - ${count} lần`;
                    viewCounts.appendChild(li);
                });
            }
        });
        if (viewCounts.children.length === 0) {
            viewCounts.innerHTML = '<li>Chưa có dữ liệu lượt xem.</li>';
        }

        // Display incomplete modules
        incompleteModules.innerHTML = '';
        course.modules.forEach((module, moduleIndex) => {
            if (module.lessonFiles) {
                const allCompleted = module.lessonFiles.every((_, lessonIndex) => progress[moduleIndex]?.[lessonIndex]);
                if (!allCompleted) {
                    const li = document.createElement('li');
                    li.textContent = `Module ${moduleIndex + 1}: ${module.title || 'Chưa có tiêu đề'}`;
                    incompleteModules.appendChild(li);
                }
            }
        });
        if (incompleteModules.children.length === 0) {
            incompleteModules.innerHTML = '<li>Đã hoàn thành tất cả module.</li>';
        }

        // Display completion times
        completionTimes.innerHTML = '';
        course.modules.forEach((module, moduleIndex) => {
            if (completionTimesData[moduleIndex]) {
                const li = document.createElement('li');
                li.textContent = `Module ${moduleIndex + 1}: ${completionTimesData[moduleIndex]} giờ`;
                completionTimes.appendChild(li);
            }
        });
        if (completionTimes.children.length === 0) {
            completionTimes.innerHTML = '<li>Chưa có module nào hoàn thành.</li>';
        }

        // Display assignment scores
        assignmentScores.innerHTML = '';
        // Course assignment
        if (course.courseAssignment && assignmentResults.course?.[0]) {
            const answers = assignmentResults.course[0];
            let score = 0;
            course.courseAssignment.questions.forEach((q, i) => {
                if (answers[i] === q.correctAnswer) score++;
            });
            const li = document.createElement('li');
            li.textContent = `Bài tập toàn khóa: ${course.courseAssignment.title} - ${score}/${course.courseAssignment.questions.length} (${((score / course.courseAssignment.questions.length) * 100).toFixed(2)}%)`;
            assignmentScores.appendChild(li);
        }
        // Chart rendering
        const ctx = document.getElementById('completionChart').getContext('2d');
        // Destroy previous chart instance if exists
        if (window.completionChartInstance) {
            window.completionChartInstance.destroy();
        }
        const completionRateValue = parseFloat(completionPercentage);
        window.completionChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Tỷ lệ hoàn thành'],
                datasets: [{
                    label: 'Tỷ lệ hoàn thành (%)',
                    data: [completionRateValue],
                    backgroundColor: '#1a3c5e',
                    borderColor: '#1a3c5e',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
        // Module assignments
        course.modules.forEach((module, moduleIndex) => {
            if (module.assignment && assignmentResults.module?.[moduleIndex]) {
                const answers = assignmentResults.module[moduleIndex];
                let score = 0;
                module.assignment.questions.forEach((q, i) => {
                    if (answers[i] === q.correctAnswer) score++;
                });
                const li = document.createElement('li');
                li.textContent = `Module ${moduleIndex + 1}, Bài tập: ${module.assignment.title} - ${score}/${module.assignment.questions.length} (${((score / module.assignment.questions.length) * 100).toFixed(2)}%)`;
                assignmentScores.appendChild(li);
            }
        });
        if (assignmentScores.children.length === 0) {
            assignmentScores.innerHTML = '<li>Chưa có bài tập nào được nộp.</li>';
        }
    });
});