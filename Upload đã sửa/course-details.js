document.addEventListener('DOMContentLoaded', () => {
    const courseTitle = document.getElementById('courseTitle');
    const courseClass = document.getElementById('courseClass');
    const modulesList = document.getElementById('modulesList');
    const editButton = document.getElementById('editButton');
    const lessonVideo = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const courseDescription = document.getElementById('courseDescription');
    const moduleDetail = document.getElementById('moduleDetail');
    const moduleAssignmentContent = document.getElementById('moduleAssignmentContent');
    const courseAssignmentContent = document.getElementById('courseAssignmentContent');

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

    // Load progress from localStorage
    let progress = JSON.parse(localStorage.getItem(`courseProgress_${course.id}`)) || {};

    // Set up edit button
    editButton.addEventListener('click', () => {
        window.location.href = `upload.html?edit=${viewIndex}`;
    });

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

        if (!progress[moduleIndex]) {
            progress[moduleIndex] = {};
        }
        progress[moduleIndex][lessonIndex] = true;
        localStorage.setItem(`courseProgress_${course.id}`, JSON.stringify(progress));

        const progressIcon = document.querySelector(`.lesson-item[data-module="${moduleIndex}"][data-lesson="${lessonIndex}"] .progress-icon`);
        if (progressIcon) {
            progressIcon.classList.add('viewed');
            progressIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        }
    }

    // Function to display assignment
    function displayAssignment(data, container, titlePrefix = '') {
        if (!data || !data.title) {
            container.innerHTML = '<p>Chưa có bài tập.</p>';
            return;
        }
        container.innerHTML = `
            <details class="assignment-item">
                <summary class="assignment-title">${titlePrefix}${data.title}</summary>
                <div class="assignment-content">
                    <p class="assignment-description">${data.description || 'Chưa có mô tả.'}</p>
                    <ol class="assignment-questions">
                        ${data.questions?.map((q, i) => `
                            <li>
                                <strong>${q.text}</strong>
                                <ul class="assignment-options">
                                    ${q.options.map((opt, j) => `
                                        <li class="${j === q.correctAnswer ? 'correct' : ''}">${opt}</li>
                                    `).join('')}
                                </ul>
                            </li>
                        `).join('') || '<li>Chưa có câu hỏi.</li>'}
                    </ol>
                </div>
            </details>
        `;
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
                module.files.forEach(file => {
                    const materialItem = document.createElement('div');
                    materialItem.className = 'material-item';
                    if (file.dataUrl) {
                        materialItem.innerHTML = `
                            <a href="${file.dataUrl}" download="${file.name}" class="material-link">
                                <i class="fas fa-download"></i> ${file.name}
                            </a>
                        `;
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
                // Display module assignment
                displayAssignment(module.assignment, moduleAssignmentContent, `Bài tập module ${moduleIndex + 1}: `);
                // Display course assignment
                displayAssignment(course.courseAssignment, courseAssignmentContent, 'Bài tập toàn khóa: ');
            });
        });
    } else {
        modulesList.innerHTML = '<p>Khóa học chưa có nội dung.</p>';
    }

    // Initially display course assignment
    displayAssignment(course.courseAssignment, courseAssignmentContent, 'Bài tập toàn khóa: ');
});