document.addEventListener('DOMContentLoaded', () => {
    const courseTitle = document.getElementById('courseTitle');
    const courseClass = document.getElementById('courseClass');
    const modulesList = document.getElementById('modulesList');
    const lessonVideo = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const courseDescription = document.getElementById('courseDescription');
    const moduleDetail = document.getElementById('moduleDetail');
    const moduleAssignmentContent = document.getElementById('moduleAssignmentContent');
    const courseAssignmentContent = document.getElementById('courseAssignmentContent');

    // Mock student ID
    const studentId = 1;

    // Load courses from localStorage
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Get course index from URL
    const urlParams = new URLSearchParams(window.location.search);
    const viewIndex = parseInt(urlParams.get('view'));

    if (isNaN(viewIndex) || viewIndex < 0 || viewIndex >= courses.length) {
        courseTitle.textContent = 'Khóa học không tồn tại';
        moduleDetail.innerHTML = '<p>Không tìm thấy khóa học.</p>';
        return;
    }

    const course = courses[viewIndex];

    // Load progress, view counts, download counts, and completion times
    let progress = JSON.parse(localStorage.getItem(`courseProgress_${course.id}_${studentId}`)) || {};
    let viewCounts = JSON.parse(localStorage.getItem(`viewCounts_${course.id}_${studentId}`)) || {};
    let downloadCounts = JSON.parse(localStorage.getItem(`downloadCounts_${course.id}_${studentId}`)) || {};
    let completionTimes = JSON.parse(localStorage.getItem(`completionTimes_${course.id}_${studentId}`)) || {};
    let assignmentResults = JSON.parse(localStorage.getItem(`assignmentResults_${course.id}_${studentId}`)) || {};

    // Populate course details
    courseTitle.textContent = course.title || 'Chưa có tiêu đề';
    courseClass.textContent = course.courseClass ? `Lớp: ${course.courseClass}` : 'Chưa chọn lớp học';
    courseDescription.textContent = course.description || 'Chưa có mô tả cho khóa học.';

    // Function to play a video
    function playVideo(file, moduleIndex, lessonIndex) {
        lessonVideo.querySelector('source').src = file.dataUrl;
        lessonVideo.querySelector('source').type = file.type;
        lessonVideo.load();
        videoTitle.textContent = file.name;
        lessonVideo.play();
        lessonVideo.scrollIntoView({ behavior: 'smooth' });

        // Increment view count
        if (!viewCounts[moduleIndex]) viewCounts[moduleIndex] = {};
        viewCounts[moduleIndex][lessonIndex] = (viewCounts[moduleIndex][lessonIndex] || 0) + 1;
        localStorage.setItem(`viewCounts_${course.id}_${studentId}`, JSON.stringify(viewCounts));

        // Mark lesson as completed
        if (!progress[moduleIndex]) progress[moduleIndex] = {};
        progress[moduleIndex][lessonIndex] = true;
        localStorage.setItem(`courseProgress_${course.id}_${studentId}`, JSON.stringify(progress));

        // Check if module is completed
        const module = course.modules[moduleIndex];
        const allLessonsCompleted = module.lessonFiles?.every((_, idx) => progress[moduleIndex][idx]);
        if (allLessonsCompleted && !completionTimes[moduleIndex]) {
            const completionTime = (Math.random() * 10 + 1).toFixed(2); // Mock completion time in hours
            completionTimes[moduleIndex] = completionTime;
            localStorage.setItem(`completionTimes_${course.id}_${studentId}`, JSON.stringify(completionTimes));
        }

        const progressIcon = document.querySelector(`.lesson-item[data-module="${moduleIndex}"][data-lesson="${lessonIndex}"] .progress-icon`);
        if (progressIcon) {
            progressIcon.classList.add('viewed');
            progressIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        }
    }

    // Function to display assignment
    function displayAssignment(data, container, titlePrefix = '', type, id) {
        if (!data || !data.title) {
            container.innerHTML = '<p>Chưa có bài tập.</p>';
            return;
        }
        container.innerHTML = `
            <details class="assignment-item" data-assignment-id="${id}">
                <summary class="assignment-title">${titlePrefix}${data.title}</summary>
                <div class="assignment-content">
                    <p class="assignment-description">${data.description || 'Chưa có mô tả.'}</p>
                    <form class="assignment-form">
                        <ol class="assignment-questions">
                            ${data.questions?.map((q, i) => `
                                <li>
                                    <strong>${q.text}</strong>
                                    <ul class="assignment-options">
                                        ${q.options.map((opt, j) => `
                                            <li>
                                                <label>
                                                    <input type="radio" name="question_${type}_${id}_${i}" value="${j}" 
                                                        ${assignmentResults[type]?.[id]?.[i] === j ? 'checked' : ''}>
                                                    ${opt}
                                                </label>
                                            </li>
                                        `).join('')}
                                    </ul>
                                    <p class="question-result" id="result_${type}_${id}_${i}" style="display: none;"></p>
                                </li>
                            `).join('') || '<li>Chưa có câu hỏi.</li>'}
                        </ol>
                        <button type="button" class="btn btn-primary submit-assignment">Nộp bài</button>
                    </form>
                </div>
            </details>
        `;

        // Handle assignment submission
        const submitButton = container.querySelector('.submit-assignment');
        submitButton.addEventListener('click', () => {
            const form = container.querySelector('.assignment-form');
            const answers = Array.from(form.querySelectorAll(`input[type="radio"]:checked`)).map(input => parseInt(input.value));
            let score = 0;
            data.questions.forEach((q, i) => {
                const isCorrect = answers[i] === q.correctAnswer;
                if (isCorrect) score++;
                const resultElement = form.querySelector(`#result_${type}_${id}_${i}`);
                resultElement.style.display = 'block';
                resultElement.textContent = isCorrect ? 'Đúng' : `Sai (Đáp án đúng: ${q.options[q.correctAnswer]})`;
                resultElement.className = `question-result ${isCorrect ? 'correct' : 'incorrect'}`;
            });

            // Save results
            if (!assignmentResults[type]) assignmentResults[type] = {};
            assignmentResults[type][id] = answers;
            localStorage.setItem(`assignmentResults_${course.id}_${studentId}`, JSON.stringify(assignmentResults));

            // Display score
            const scoreDisplay = document.createElement('p');
            scoreDisplay.className = 'assignment-score';
            scoreDisplay.textContent = `Điểm: ${score}/${data.questions.length} (${(score / data.questions.length * 100).toFixed(2)}%)`;
            container.querySelector('.assignment-content').appendChild(scoreDisplay);

            // Disable form
            form.querySelectorAll('input').forEach(input => input.disabled = true);
            submitButton.disabled = true;
        });

        // Load previous results
        if (assignmentResults[type]?.[id]) {
            data.questions.forEach((q, i) => {
                const resultElement = container.querySelector(`#result_${type}_${id}_${i}`);
                const isCorrect = assignmentResults[type][id][i] === q.correctAnswer;
                resultElement.style.display = 'block';
                resultElement.textContent = isCorrect ? 'Đúng' : `Sai (Đáp án đúng: ${q.options[q.correctAnswer]})`;
                resultElement.className = `question-result ${isCorrect ? 'correct' : 'incorrect'}`;
            });
            const scoreDisplay = document.createElement('p');
            scoreDisplay.className = 'assignment-score';
            const score = data.questions.reduce((acc, q, i) => acc + (assignmentResults[type][id][i] === q.correctAnswer ? 1 : 0), 0);
            scoreDisplay.textContent = `Điểm: ${score}/${data.questions.length} (${(score / data.questions.length * 100).toFixed(2)}%)`;
            container.querySelector('.assignment-content').appendChild(scoreDisplay);
            container.querySelectorAll('input').forEach(input => input.disabled = true);
            submitButton.disabled = true;
        }
    }

    // Populate modules
    if (course.modules && course.modules.length > 0) {
        course.modules.forEach((module, moduleIndex) => {
            const moduleItem = document.createElement('div');
            moduleItem.className = 'module-item';
            moduleItem.innerHTML = `
                <details>
                    <summary>
                        <span class="module-title">Module ${moduleIndex + 1}: ${module.title || 'Chưa có tiêu đề'}</span>
                    </summary>
                    <div class="module-content">
                        <div class="lessons-list">
                            <h4>Bài học</h4>
                            <div class="lessons"></div>
                        </div>
                        <div class="materials-list">
                            <h4>Tài liệu bài học</h4>
                            <div class="materials"></div>
                        </div>
                    </div>
                </details>
            `;
            modulesList.appendChild(moduleItem);

            const lessonsContainer = moduleItem.querySelector('.lessons');
            if (module.lessonFiles && module.lessonFiles.length > 0) {
                module.lessonFiles.forEach((file, lessonIndex) => {
                    const isViewed = progress[moduleIndex]?.[lessonIndex];
                    const lessonItem = document.createElement('div');
                    lessonItem.className = 'lesson-item';
                    lessonItem.dataset.module = moduleIndex;
                    lessonItem.dataset.lesson = lessonIndex;
                    lessonItem.innerHTML = `
                        <button class="play-button">
                            <i class="fas fa-play"></i> ${file.name}
                        </button>
                        <span class="progress-icon ${isViewed ? 'viewed' : ''}">
                            <i class="fas ${isViewed ? 'fa-check-circle' : 'fa-circle'}"></i>
                        </span>
                    `;
                    lessonsContainer.appendChild(lessonItem);

                    const playButton = lessonItem.querySelector('.play-button');
                    playButton.addEventListener('click', () => {
                        playVideo(file, moduleIndex, lessonIndex);
                    });
                });
            } else {
                lessonsContainer.innerHTML += '<p>Chưa có bài học.</p>';
            }

            const materialsContainer = moduleItem.querySelector('.materials');
            if (module.files && module.files.length > 0) {
                module.files.forEach((file, fileIndex) => {
                    const materialItem = document.createElement('div');
                    materialItem.className = 'material-item';
                    if (file.dataUrl) {
                        materialItem.innerHTML = `
                            <a href="${file.dataUrl}" download="${file.name}" class="material-link">
                                <i class="fas fa-download"></i> ${file.name}
                            </a>
                        `;
                        materialItem.querySelector('a').addEventListener('click', () => {
                            if (!downloadCounts[moduleIndex]) downloadCounts[moduleIndex] = {};
                            downloadCounts[moduleIndex][fileIndex] = (downloadCounts[moduleIndex][fileIndex] || 0) + 1;
                            localStorage.setItem(`downloadCounts_${course.id}_${studentId}`, JSON.stringify(downloadCounts));
                        });
                    } else {
                        materialItem.innerHTML = `<p>${file.name} (Không thể tải do thiếu dữ liệu)</p>`;
                    }
                    materialsContainer.appendChild(materialItem);
                });
            } else {
                materialsContainer.innerHTML += '<p>Chưa có tài liệu.</p>';
            }

            moduleItem.querySelector('summary').addEventListener('click', () => {
                moduleDetail.innerHTML = `
                    <h3>${module.title || 'Chưa có tiêu đề module'}</h3>
                    <p>${module.description || 'Chưa có mô tả module.'}</p>
                    <ul>
                        ${(module.lessonFiles || []).map(file => `
                            <li>
                                ${file.type && file.type.startsWith('video/') ? `<i class="fas fa-play"></i>` : `<i class="fas fa-file"></i>`}
                                ${file.name}
                            </li>
                        `).join('')}
                    </ul>
                `;
                displayAssignment(module.assignment, moduleAssignmentContent, `Bài tập module ${moduleIndex + 1}: `, 'module', moduleIndex);
                displayAssignment(course.courseAssignment, courseAssignmentContent, 'Bài tập toàn khóa: ', 'course', 0);
            });
        });
    } else {
        modulesList.innerHTML = '<p>Khóa học chưa có nội dung.</p>';
    }

    // Initially display course assignment
    displayAssignment(course.courseAssignment, courseAssignmentContent, 'Bài tập toàn khóa: ', 'course', 0);
});