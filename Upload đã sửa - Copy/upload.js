document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('courseForm');
    const imageInput = document.getElementById('courseImage');
    const imagePreview = document.getElementById('imagePreview');
    const modulesContainer = document.getElementById('modulesContainer');
    const addModuleButton = document.getElementById('addModuleButton');
    const submitButton = form.querySelector('button[type="submit"]');
    const courseIdInput = document.getElementById('courseId');

    // Load existing courses from localStorage
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    let moduleCount = 0;

    // Check if editing an existing course
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get('edit');
    let isEditing = false;
    let courseToEdit = null;

    if (editIndex !== null) {
        const index = parseInt(editIndex);
        if (index >= 0 && index < courses.length) {
            isEditing = true;
            courseToEdit = courses[index];
            // Pre-fill form
            document.getElementById('courseTitle').value = courseToEdit.title;
            document.getElementById('courseDescription').value = courseToEdit.description || '';
            document.getElementById('courseCategory').value = courseToEdit.category;
            document.getElementById('courseClass').value = courseToEdit.courseClass;
            courseIdInput.value = courseToEdit.id;
            imagePreview.innerHTML = `<img src="${courseToEdit.image}" alt="Course Image Preview">`;
            submitButton.textContent = 'Cập nhật khóa học';
            // Pre-fill modules
            if (courseToEdit.modules && courseToEdit.modules.length > 0) {
                courseToEdit.modules.forEach((module, index) => {
                    addModule(module.title, module.lessonFiles, module.files, index, module.description);
                });
            }
        }
};;

    // Function to add a new module
    function addModule(title = '', lessonFiles = [], files = [], moduleIndex = moduleCount, description = '') {
        const moduleDiv = document.createElement('div');
        moduleDiv.className = 'module';
        moduleDiv.dataset.index = moduleIndex;
        moduleDiv.innerHTML = `
            <h3>Module ${moduleIndex + 1}</h3>
            <div class="form-group">
                <label for="moduleTitle${moduleIndex}">Tiêu đề module <span>*</span></label>
                <input type="text" id="moduleTitle${moduleIndex}" name="moduleTitle${moduleIndex}" value="${title}" required>
            </div>
            <div class="form-group">
                <label for="moduleDescription${moduleIndex}">Mô tả module</label>
                <textarea id="moduleDescription${moduleIndex}" name="moduleDescription${moduleIndex}">${description}</textarea>
            </div>
            <div class="form-group">
                <label for="moduleLesson${moduleIndex}">Bài học</label>
                <input type="file" id="moduleLesson${moduleIndex}" name="moduleLesson${moduleIndex}" accept="video/*,application/pdf" multiple>
                <div id="lessonPreview${moduleIndex}" class="lesson-preview"></div>
            </div>
            <div class="form-group">
                <label for="moduleFiles${moduleIndex}">Tài liệu bài học</label>
                <input type="file" id="moduleFiles${moduleIndex}" name="moduleFiles${moduleIndex}" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" multiple>
                <div id="fileList${moduleIndex}" class="file-list"></div>
            </div>
            <button type="button" class="deleteModuleButton">Xóa Module</button>
        `;
        modulesContainer.appendChild(moduleDiv);
        moduleCount++;

        // Handle lesson file preview
        const lessonInput = moduleDiv.querySelector(`#moduleLesson${moduleIndex}`);
        const lessonPreview = moduleDiv.querySelector(`#lessonPreview${moduleIndex}`);
        lessonInput.addEventListener('change', () => {
            lessonPreview.innerHTML = '';
            const files = lessonInput.files;
            if (files.length === 0) {
                lessonPreview.innerHTML = '<p>Chưa chọn file nào.</p>';
                return;
            }
            const fileCount = document.createElement('p');
            fileCount.textContent = `Đã chọn ${files.length} file(s).`;
            fileCount.style.fontWeight = 'bold';
            lessonPreview.appendChild(fileCount);
            Array.from(files).forEach(file => {
                const fileContainer = document.createElement('div');
                fileContainer.style.marginBottom = '10px';
                if (file.type.startsWith('video/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const video = document.createElement('video');
                        video.controls = true;
                        video.style.maxWidth = '100%';
                        video.style.maxHeight = '250px';
                        video.innerHTML = `<source src="${e.target.result}" type="${file.type}">`;
                        fileContainer.appendChild(video);
                        const fileName = document.createElement('p');
                        fileName.textContent = `File: ${file.name}`;
                        fileContainer.appendChild(fileName);
                        lessonPreview.appendChild(fileContainer);
                    };
                    reader.readAsDataURL(file);
                } else {
                    const p = document.createElement('p');
                    p.textContent = `File: ${file.name}`;
                    fileContainer.appendChild(p);
                    lessonPreview.appendChild(fileContainer);
                }
            });
        });

        // Handle course file preview
        const filesInput = moduleDiv.querySelector(`#moduleFiles${moduleIndex}`);
        const fileList = moduleDiv.querySelector(`#fileList${moduleIndex}`);
        filesInput.addEventListener('change', () => {
            fileList.innerHTML = '';
            const files = filesInput.files;
            if (files.length === 0) {
                fileList.innerHTML = '<p>Chưa chọn file nào.</p>';
                return;
            }
            const fileCount = document.createElement('p');
            fileCount.textContent = `Đã chọn ${files.length} file(s).`;
            fileCount.style.fontWeight = 'bold';
            fileList.appendChild(fileCount);
            Array.from(files).forEach(file => {
                const fileContainer = document.createElement('div');
                fileContainer.style.marginBottom = '10px';
                const p = document.createElement('p');
                p.textContent = `File: ${file.name}`;
                fileContainer.appendChild(p);
                fileList.appendChild(fileContainer);
            });
        });

        // Handle delete module
        const deleteButton = moduleDiv.querySelector('.deleteModuleButton');
        deleteButton.addEventListener('click', () => {
            moduleDiv.remove();
            // Re-number modules
            Array.from(modulesContainer.querySelectorAll('.module')).forEach((mod, idx) => {
                mod.dataset.index = idx;
                mod.querySelector('h3').textContent = `Module ${idx + 1}`;
                const inputs = mod.querySelectorAll('input, div[id], textarea');
                inputs.forEach(input => {
                    if (input.id) {
                        input.id = input.id.replace(/\d+$/, idx);
                    }
                    if (input.name) {
                        input.name = input.name.replace(/\d+$/, idx);
                    }
                });
            });
            moduleCount--;
        });

        // Pre-fill existing files for editing
        if (lessonFiles.length > 0) {
            lessonPreview.innerHTML = `<p>Đã chọn ${lessonFiles.length} file(s).</p>`;
            lessonFiles.forEach(file => {
                const fileContainer = document.createElement('div');
                fileContainer.style.marginBottom = '10px';
                if (file.dataUrl && file.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.controls = true;
                    video.style.maxWidth = '100%';
                    video.style.maxHeight = '250px';
                    video.innerHTML = `<source src="${file.dataUrl}" type="${file.type}">`;
                    fileContainer.appendChild(video);
                }
                const p = document.createElement('p');
                p.textContent = `File: ${file.name}`;
                fileContainer.appendChild(p);
                lessonPreview.appendChild(fileContainer);
            });
        }
        if (files.length > 0) {
            fileList.innerHTML = `<p>Đã chọn ${files.length} file(s).</p>`;
            files.forEach(file => {
                const fileContainer = document.createElement('div');
                fileContainer.style.marginBottom = '10px';
                const p = document.createElement('p');
                p.textContent = `File: ${file.name}`;
                fileContainer.appendChild(p);
                fileList.appendChild(fileContainer);
            });
        }
    }

    // Add module button
    addModuleButton.addEventListener('click', () => {
        addModule();
    });

    // Add at least one module by default if not editing
    if (!isEditing) {
        addModule();
    }

    // Preview image
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Course Image Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate form
        const title = document.getElementById('courseTitle').value.trim();
        const description = document.getElementById('courseDescription').value.trim();
        const category = document.getElementById('courseCategory').value;
        const courseClass = document.getElementById('courseClass').value;
        const image = imageInput.files[0];
        const modules = Array.from(modulesContainer.querySelectorAll('.module'));

        if (!title || !description || !category || !courseClass || (!image && !isEditing)) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Mô tả, Môn học, Lớp học, Hình ảnh).');
            return;
        }
        if (modules.length === 0) {
            alert('Vui lòng thêm ít nhất một module.');
            return;
        }

        // Process files asynchronously
        const readFiles = (fileList) => {
            return Promise.all(Array.from(fileList).map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({
                            name: file.name,
                            type: file.type,
                            dataUrl: e.target.result
                        });
                    };
                    reader.readAsDataURL(file);
                });
            }));
        };

        // Collect module data
        const modulePromises = modules.map(module => {
            const index = module.dataset.index;
            const moduleTitle = module.querySelector(`#moduleTitle${index}`).value.trim();
            const moduleDescription = module.querySelector(`#moduleDescription${index}`).value.trim();
            const lessonInput = module.querySelector(`#moduleLesson${index}`);
            const filesInput = module.querySelector(`#moduleFiles${index}`);
            if (!moduleTitle) {
                alert(`Vui lòng nhập tiêu đề cho Module ${parseInt(index) + 1}.`);
                throw new Error('Missing module title');
            }
            return Promise.all([
                readFiles(lessonInput.files),
                readFiles(filesInput.files)
            ]).then(([lessonFilesData, filesData]) => ({
                title: moduleTitle,
                description: moduleDescription,
                lessonFiles: lessonFilesData,
                files: filesData
            }));
        });

        const saveCourse = (imageDataUrl) => {
            Promise.all(modulePromises)
                .then(modulesData => {
                    const courseData = {
                        id: isEditing ? courseToEdit.id : Date.now(),
                        title: title,
                        description: description,
                        category: category,
                        courseClass: courseClass,
                        image: imageDataUrl || courseToEdit?.image,
                        modules: modulesData
                    };

                    if (isEditing) {
                        courses[editIndex] = courseData;
                    } else {
                        courses.push(courseData);
                    }

                    try {
                        localStorage.setItem('courses', JSON.stringify(courses));
                    } catch (e) {
                        alert('Dung lượng file quá lớn để lưu trữ trong localStorage. Vui lòng giảm số lượng hoặc kích thước file, hoặc sử dụng server để lưu trữ.');
                        return;
                    }

                    console.log('Dữ liệu khóa học:', courseData);

                    alert(isEditing ? 'Khóa học đã được cập nhật thành công!' : 'Khóa học đã được đăng tải thành công!');
                    form.reset();
                    imagePreview.innerHTML = '';
                    modulesContainer.innerHTML = '';
                    moduleCount = 0;
                    addModule(); // Add one empty module for next creation
                    window.location.href = 'courses.html';
                })
                .catch(err => {
                    if (err.message !== 'Missing module title') {
                        console.error('Lỗi khi xử lý file:', err);
                        alert('Đã xảy ra lỗi khi xử lý file. Vui lòng thử lại.');
                    }
                });
        };

        if (image) {
            const reader = new FileReader();
            reader.onload = (e) => saveCourse(e.target.result);
            reader.readAsDataURL(image);
        } else {
            saveCourse();
        }
    });
});