document.addEventListener('DOMContentLoaded', () => {
    const courseSelect = document.getElementById('courseSelect');
    const averageCompletion = document.getElementById('averageCompletion');
    const mostViewedLesson = document.getElementById('mostViewedLesson');
    const mostDownloadedMaterial = document.getElementById('mostDownloadedMaterial');
    const averageCompletionTimes = document.getElementById('averageCompletionTimes');
    const averageAssignmentScores = document.getElementById('averageAssignmentScores');
    const studentProgressTableBody = document.querySelector('#studentProgressTable tbody');

    // Mock student IDs (for demo purposes)
    const studentIds = [1, 2, 3]; // Simulate multiple students

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
            averageCompletion.textContent = '0%';
            mostViewedLesson.textContent = 'Chưa có dữ liệu';
            mostDownloadedMaterial.textContent = 'Chưa có dữ liệu';
            averageCompletionTimes.innerHTML = '<li>Vui lòng chọn khóa học.</li>';
            averageAssignmentScores.innerHTML = '<li>Vui lòng chọn khóa học.</li>';
            studentProgressTableBody.innerHTML = '<tr><td colspan="4">Vui lòng chọn khóa học.</td></tr>';
            return;
        }

        const course = courses[courseIndex];

        // Aggregate data across all students
        let totalCompletion = 0;
        let viewCountsAggregate = {};
        let downloadCountsAggregate = {};
        let completionTimesAggregate = {};
        let assignmentScoresAggregate = { course: [], module: {} };
        let studentProgressData = [];

        studentIds.forEach(studentId => {
            const progress = JSON.parse(localStorage.getItem(`courseProgress_${course.id}_${studentId}`)) || {};
            const viewCounts = JSON.parse(localStorage.getItem(`viewCounts_${course.id}_${studentId}`)) || {};
            const downloadCounts = JSON.parse(localStorage.getItem(`downloadCounts_${course.id}_${studentId}`)) || {};
            const completionTimes = JSON.parse(localStorage.getItem(`completionTimes_${course.id}_${studentId}`)) || {};
            const assignmentResults = JSON.parse(localStorage.getItem(`assignmentResults_${course.id}_${studentId}`)) || {};

            // Calculate completion rate for this student
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
            totalCompletion += parseFloat(completionPercentage);

            // Aggregate view counts
            Object.keys(viewCounts).forEach(moduleIndex => {
                if (!viewCountsAggregate[moduleIndex]) viewCountsAggregate[moduleIndex] = {};
                Object.keys(viewCounts[moduleIndex]).forEach(lessonIndex => {
                    viewCountsAggregate[moduleIndex][lessonIndex] = (viewCountsAggregate[moduleIndex][lessonIndex] || 0) + viewCounts[moduleIndex][lessonIndex];
                });
            });

            // Aggregate download counts
            Object.keys(downloadCounts).forEach(moduleIndex => {
                if (!downloadCountsAggregate[moduleIndex]) downloadCountsAggregate[moduleIndex] = {};
                Object.keys(downloadCounts[moduleIndex]).forEach(fileIndex => {
                    downloadCountsAggregate[moduleIndex][fileIndex] = (downloadCountsAggregate[moduleIndex][fileIndex] || 0) + downloadCounts[moduleIndex][fileIndex];
                });
            });

            // Aggregate completion times
            Object.keys(completionTimes).forEach(moduleIndex => {
                if (!completionTimesAggregate[moduleIndex]) completionTimesAggregate[moduleIndex] = [];
                completionTimesAggregate[moduleIndex].push(parseFloat(completionTimes[moduleIndex]));
            });

            // Aggregate assignment scores
            let assignmentScoresText = [];
            // Course assignment
            if (course.courseAssignment && assignmentResults.course?.[0]) {
                let score = 0;
                const answers = assignmentResults.course[0];
                course.courseAssignment.questions.forEach((q, i) => {
                    if (answers[i] === q.correctAnswer) score++;
                });
                const percentage = ((score / course.courseAssignment.questions.length) * 100).toFixed(2);
                assignmentScoresAggregate.course.push({ score, total: course.courseAssignment.questions.length });
                assignmentScoresText.push(`Bài tập toàn khóa: ${score}/${course.courseAssignment.questions.length} (${percentage}%)`);
            }
            // Module assignments
            course.modules.forEach((module, moduleIndex) => {
                if (module.assignment && assignmentResults.module?.[moduleIndex]) {
                    let score = 0;
                    const answers = assignmentResults.module[moduleIndex];
                    module.assignment.questions.forEach((q, i) => {
                        if (answers[i] === q.correctAnswer) score++;
                    });
                    const percentage = ((score / module.assignment.questions.length) * 100).toFixed(2);
                    if (!assignmentScoresAggregate.module[moduleIndex]) assignmentScoresAggregate.module[moduleIndex] = [];
                    assignmentScoresAggregate.module[moduleIndex].push({ score, total: module.assignment.questions.length });
                    assignmentScoresText.push(`Module ${moduleIndex + 1}: ${score}/${module.assignment.questions.length} (${percentage}%)`);
                }
            });

            // Collect student progress data
            const incompleteModules = course.modules
                .map((module, moduleIndex) => {
                    if (module.lessonFiles && !module.lessonFiles.every((_, lessonIndex) => progress[moduleIndex]?.[lessonIndex])) {
                        return `Module ${moduleIndex + 1}: ${module.title || 'Chưa có tiêu đề'}`;
                    }
                    return null;
                })
                .filter(Boolean);
            studentProgressData.push({
                studentId,
                completionPercentage,
                incompleteModules: incompleteModules.join(', ') || 'Hoàn thành tất cả',
                assignmentScores: assignmentScoresText.join('; ') || 'Chưa nộp bài tập'
            });
        });

        // Display average completion
        averageCompletion.textContent = `${(totalCompletion / studentIds.length).toFixed(2)}%`;

        // Find most viewed lesson
        let maxViews = 0;
        let mostViewed = 'Chưa có dữ liệu';
        Object.keys(viewCountsAggregate).forEach(moduleIndex => {
            Object.keys(viewCountsAggregate[moduleIndex]).forEach(lessonIndex => {
                const views = viewCountsAggregate[moduleIndex][lessonIndex];
                if (views > maxViews) {
                    maxViews = views;
                    const module = course.modules[parseInt(moduleIndex)];
                    const lesson = module.lessonFiles[parseInt(lessonIndex)];
                    mostViewed = `Module ${parseInt(moduleIndex) + 1}, Bài học: ${lesson.name} (${views} lượt)`;
                }
            });
        });
        mostViewedLesson.textContent = mostViewed;

        // Find most downloaded material
        let maxDownloads = 0;
        let mostDownloaded = 'Chưa có dữ liệu';
        Object.keys(downloadCountsAggregate).forEach(moduleIndex => {
            Object.keys(downloadCountsAggregate[moduleIndex]).forEach(fileIndex => {
                const downloads = downloadCountsAggregate[moduleIndex][fileIndex];
                if (downloads > maxDownloads) {
                    maxDownloads = downloads;
                    const module = course.modules[parseInt(moduleIndex)];
                    const file = module.files[parseInt(fileIndex)];
                    mostDownloaded = `Module ${parseInt(moduleIndex) + 1}, Tài liệu: ${file.name} (${downloads} lượt)`;
                }
            });
        });
        mostDownloadedMaterial.textContent = mostDownloaded;

        // Display average completion times
        averageCompletionTimes.innerHTML = '';
        course.modules.forEach((module, moduleIndex) => {
            if (completionTimesAggregate[moduleIndex] && completionTimesAggregate[moduleIndex].length > 0) {
                const avgTime = completionTimesAggregate[moduleIndex].reduce((sum, time) => sum + time, 0) / completionTimesAggregate[moduleIndex].length;
                const li = document.createElement('li');
                li.textContent = `Module ${moduleIndex + 1}: ${avgTime.toFixed(2)} giờ`;
                averageCompletionTimes.appendChild(li);
            }
        });
        if (averageCompletionTimes.children.length === 0) {
            averageCompletionTimes.innerHTML = '<li>Chưa có dữ liệu thời gian hoàn thành.</li>';
        }

        // Display average assignment scores
        averageAssignmentScores.innerHTML = '';
        // Course assignment
        if (assignmentScoresAggregate.course.length > 0) {
            const avgScore = assignmentScoresAggregate.course.reduce((sum, { score }) => sum + score, 0) / assignmentScoresAggregate.course.length;
            const total = assignmentScoresAggregate.course[0].total;
            const li = document.createElement('li');
            li.textContent = `Bài tập toàn khóa: ${avgScore.toFixed(2)}/${total} (${((avgScore / total) * 100).toFixed(2)}%)`;
            averageAssignmentScores.appendChild(li);
        }
        // Module assignments
        course.modules.forEach((module, moduleIndex) => {
            if (assignmentScoresAggregate.module[moduleIndex]?.length > 0) {
                const avgScore = assignmentScoresAggregate.module[moduleIndex].reduce((sum, { score }) => sum + score, 0) / assignmentScoresAggregate.module[moduleIndex].length;
                const total = assignmentScoresAggregate.module[moduleIndex][0].total;
                const li = document.createElement('li');
                li.textContent = `Module ${moduleIndex + 1}: ${avgScore.toFixed(2)}/${total} (${((avgScore / total) * 100).toFixed(2)}%)`;
                averageAssignmentScores.appendChild(li);
            }
        });
        if (averageAssignmentScores.children.length === 0) {
            averageAssignmentScores.innerHTML = '<li>Chưa có bài tập nào được nộp.</li>';
        }
        // Chart.js rendering for average completion
        if (typeof Chart !== 'undefined') {
            const ctx = document.getElementById('completionChart').getContext('2d');
            // Destroy previous chart instance if it exists
            if (window.completionChartInstance) {
                window.completionChartInstance.destroy();
            }
            const avgCompletionValue = parseFloat(averageCompletion.textContent);
            window.completionChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Tiến độ trung bình'],
                    datasets: [{
                        label: 'Tiến độ trung bình (%)',
                        data: [avgCompletionValue],
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
        } else {
            console.error('Chart.js is not loaded.');
        }

        // Display student progress table
        studentProgressData.sort((a, b) => b.completionPercentage - a.completionPercentage);
        studentProgressTableBody.innerHTML = '';
        studentProgressData.forEach(data => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>Học sinh ${data.studentId}</td>
                <td>${data.completionPercentage}%</td>
                <td>${data.incompleteModules}</td>
                <td>${data.assignmentScores}</td>
            `;
            studentProgressTableBody.appendChild(tr);
        });
    });
});