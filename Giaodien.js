    let currentEditItem = null;

    function openModal() {
      document.getElementById('courseModal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('courseModal').style.display = 'none';
    }

    function createCourse() {
      const courseName = document.getElementById('courseName').value;
      if (courseName) {
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('courseDetails').style.display = 'flex';
        document.getElementById('courseNameInput').value = courseName;
        closeModal();
      } else {
        alert('Vui lòng nhập tên khóa học!');
      }
    }

    function publishCourse() {
      const courseName = document.getElementById('courseNameInput').value;
      if (courseName) {
        document.getElementById('courseDetails').style.display = 'none';
        document.getElementById('courseOverview').style.display = 'block';
        document.getElementById('courseTitle').textContent = courseName;
      } else {
        alert('Vui lòng nhập tên khóa học trước khi xuất bản!');
      }
    }

    function unpublishCourse() {
      document.getElementById('courseOverview').style.display = 'none';
      document.getElementById('courseDetails').style.display = 'flex';
    }

    function updateDescription() {
      const description = document.getElementById('courseDescription').value;
      if (description) {
        alert('Mô tả khóa học đã được cập nhật!');
      } else {
        alert('Vui lòng nhập mô tả trước khi cập nhật!');
      }
    }

    function addSyllabusItem() {
      const lessonTitle = document.getElementById('lessonTitle').value;
      const lessonVideo = document.getElementById('lessonVideo').files[0];
      const assignmentContent = document.getElementById('assignmentContent').value;
      const assignmentFiles = document.getElementById('assignmentFile').files;
      const quizLink = document.getElementById('quizLink').value;

      if (lessonTitle) {
        const syllabusList = document.getElementById('syllabusList');
        const syllabusItem = document.createElement('div');
        syllabusItem.className = 'syllabus-item';

        const uniqueId = Date.now(); // Unique identifier for this syllabus item

        let videoHTML = '';
        if (lessonVideo) {
          const videoURL = URL.createObjectURL(lessonVideo);
          videoHTML = `
            <div class="subtopic" id="video-${uniqueId}">
              <div class="subtopic-header" onclick="toggleSubtopic(this)">
                <i class="fas fa-chevron-down"></i> Video bài giảng
              </div>
              <div class="subtopic-content">
                <video controls>
                  <source src="${videoURL}" type="${lessonVideo.type}">
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              </div>
              <div class="subtopic-links">
                <a href="#assignment-${uniqueId}" onclick="scrollToSubtopic('assignment-${uniqueId}')">Bài tập</a>
                <a href="#quiz-${uniqueId}" onclick="scrollToSubtopic('quiz-${uniqueId}')">Bài kiểm tra</a>
              </div>
            </div>
          `;
        } else {
          videoHTML = `
            <div class="subtopic" id="video-${uniqueId}">
              <div class="subtopic-header" onclick="toggleSubtopic(this)">
                <i class="fas fa-chevron-down"></i> Video bài giảng
              </div>
              <div class="subtopic-content">
                <p>Chưa có video</p>
              </div>
              <div class="subtopic-links">
                <a href="#assignment-${uniqueId}" onclick="scrollToSubtopic('assignment-${uniqueId}')">Bài tập</a>
                <a href="#quiz-${uniqueId}" onclick="scrollToSubtopic('quiz-${uniqueId}')">Bài kiểm tra</a>
              </div>
            </div>
          `;
        }

        let assignmentHTML = '';
        let assignmentContentHTML = assignmentContent ? (assignmentContent.includes('http') ? `<a href="${assignmentContent}" target="_blank">${assignmentContent}</a>` : assignmentContent) : 'Chưa có nội dung';
        let assignmentFilesHTML = '';
        if (assignmentFiles.length > 0) {
          assignmentFilesHTML = '<p>Tệp đính kèm:</p><ul>';
          Array.from(assignmentFiles).forEach(file => {
            const fileURL = URL.createObjectURL(file);
            assignmentFilesHTML += `<li><a href="${fileURL}" download="${file.name}">${file.name}</a></li>`;
          });
          assignmentFilesHTML += '</ul>';
        } else {
          assignmentFilesHTML = '<p>Không có tệp đính kèm</p>';
        }
        assignmentHTML = `
          <div class="subtopic" id="assignment-${uniqueId}">
            <div class="subtopic-header" onclick="toggleSubtopic(this)">
              <i class="fas fa-chevron-down"></i> Bài tập
            </div>
            <div class="subtopic-content">
              <p class="assignment">${assignmentContentHTML}</p>
              ${assignmentFilesHTML}
            </div>
            <div class="subtopic-links">
              <a href="#video-${uniqueId}" onclick="scrollToSubtopic('video-${uniqueId}')">Video bài giảng</a>
              <a href="#quiz-${uniqueId}" onclick="scrollToSubtopic('quiz-${uniqueId}')">Bài kiểm tra</a>
            </div>
          </div>
        `;

        const quizHTML = `
          <div class="subtopic" id="quiz-${uniqueId}">
            <div class="subtopic-header" onclick="toggleSubtopic(this)">
              <i class="fas fa-chevron-down"></i> Bài kiểm tra
            </div>
            <div class="subtopic-content">
              <p class="quiz">${quizLink ? `<a href="${quizLink}" target="_blank">${quizLink}</a>` : 'Chưa có'}</p>
            </div>
            <div class="subtopic-links">
              <a href="#video-${uniqueId}" onclick="scrollToSubtopic('video-${uniqueId}')">Video bài giảng</a>
              <a href="#assignment-${uniqueId}" onclick="scrollToSubtopic('assignment-${uniqueId}')">Bài tập</a>
            </div>
          </div>
        `;

        syllabusItem.innerHTML = `
          <div class="header">
            <h3>${lessonTitle}</h3>
            <i class="fas fa-chevron-down toggle-btn" onclick="toggleMaterials(this)"></i>
          </div>
          <div class="materials">
            ${videoHTML}
            ${assignmentHTML}
            ${quizHTML}
            <div class="actions">
              <div class="edit-btn" onclick="openEditModal(this.closest('.syllabus-item'))">
                <i class="fas fa-edit"></i>
              </div>
              <div class="delete-btn" onclick="clearSyllabusItemContent(this.closest('.syllabus-item'))">
                <i class="fas fa-trash"></i>
              </div>
            </div>
          </div>
        `;

        syllabusList.appendChild(syllabusItem);

        document.getElementById('lessonTitle').value = '';
        document.getElementById('lessonVideo').value = '';
        document.getElementById('assignmentContent').value = '';
        document.getElementById('assignmentFile').value = '';
        document.getElementById('quizLink').value = '';
      } else {
        alert('Vui lòng nhập tiêu đề bài học!');
      }
    }

    function toggleMaterials(btn) {
      const materials = btn.closest('.syllabus-item').querySelector('.materials');
      const isHidden = materials.style.display === 'none';
      materials.style.display = isHidden ? 'block' : 'none';
      btn.classList.toggle('fa-chevron-down', !isHidden);
      btn.classList.toggle('fa-chevron-up', isHidden);
    }

    function toggleSubtopic(header) {
      const content = header.nextElementSibling;
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? 'block' : 'none';
      const icon = header.querySelector('i');
      icon.classList.toggle('fa-chevron-down', !isHidden);
      icon.classList.toggle('fa-chevron-up', isHidden);
    }

    function scrollToSubtopic(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        const header = element.querySelector('.subtopic-header');
        const content = element.querySelector('.subtopic-content');
        if (content.style.display === 'none') {
          header.click(); // Expand if collapsed
        }
      }
    }

    function openEditModal(item) {
      currentEditItem = item;
      const assignment = item.querySelector('.assignment').innerText.replace('Chưa có nội dung', '');
      const quiz = item.querySelector('.quiz').innerText.replace('Chưa có', '');

      document.getElementById('editAssignmentContent').value = assignment;
      document.getElementById('editAssignmentFile').value = ''; // Reset file input
      document.getElementById('editQuizLink').value = quiz;
      document.getElementById('editLessonVideo').value = ''; // Reset file input
      document.getElementById('editItemModal').style.display = 'block';
    }

    function closeEditModal() {
      document.getElementById('editItemModal').style.display = 'none';
      currentEditItem = null;
    }

    function updateSyllabusItem() {
      if (currentEditItem) {
        const newVideo = document.getElementById('editLessonVideo').files[0];
        const newAssignmentContent = document.getElementById('editAssignmentContent').value;
        const newAssignmentFiles = document.getElementById('editAssignmentFile').files;
        const newQuiz = document.getElementById('editQuizLink').value;

        const videoSubtopic = currentEditItem.querySelector('.subtopic[id^="video-"]');
        if (newVideo) {
          const videoURL = URL.createObjectURL(newVideo);
          videoSubtopic.querySelector('.subtopic-content').innerHTML = `
            <video controls>
              <source src="${videoURL}" type="${newVideo.type}">
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          `;
        }

        const assignmentSubtopic = currentEditItem.querySelector('.subtopic[id^="assignment-"]');
        let assignmentContentHTML = newAssignmentContent ? (newAssignmentContent.includes('http') ? `<a href="${newAssignmentContent}" target="_blank">${newAssignmentContent}</a>` : newAssignmentContent) : 'Chưa có nội dung';
        let assignmentFilesHTML = '';
        if (newAssignmentFiles.length > 0) {
          assignmentFilesHTML = '<p>Tệp đính kèm:</p><ul>';
          Array.from(newAssignmentFiles).forEach(file => {
            const fileURL = URL.createObjectURL(file);
            assignmentFilesHTML += `<li><a href="${fileURL}" download="${file.name}">${file.name}</a></li>`;
          });
          assignmentFilesHTML += '</ul>';
        } else {
          const existingFilesList = assignmentSubtopic.querySelector('.subtopic-content ul');
          assignmentFilesHTML = existingFilesList ? `<p>Tệp đính kèm:</p>${existingFilesList.outerHTML}` : '<p>Không có tệp đính kèm</p>';
        }
        assignmentSubtopic.querySelector('.subtopic-content').innerHTML = `
          <p class="assignment">${assignmentContentHTML}</p>
          ${assignmentFilesHTML}
        `;

        const quizSubtopic = currentEditItem.querySelector('.subtopic[id^="quiz-"]');
        quizSubtopic.querySelector('.subtopic-content').innerHTML = `
          <p class="quiz">${newQuiz ? `<a href="${newQuiz}" target="_blank">${newQuiz}</a>` : 'Chưa có'}</p>
        `;

        closeEditModal();
      }
    }

    function clearSyllabusItemContent(item) {
      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ nội dung của học phần này?')) {
        const uniqueId = item.querySelector('.subtopic[id^="video-"]').id.split('-')[1];
        const materials = item.querySelector('.materials');
        materials.innerHTML = `
          <div class="subtopic" id="video-${uniqueId}">
            <div class="subtopic-header" onclick="toggleSubtopic(this)">
              <i class="fas fa-chevron-down"></i> Video bài giảng
            </div>
            <div class="subtopic-content">
              <p>Chưa có video</p>
            </div>
            <div class="subtopic-links">
              <a href="#assignment-${uniqueId}" onclick="scrollToSubtopic('assignment-${uniqueId}')">Bài tập</a>
              <a href="#quiz-${uniqueId}" onclick="scrollToSubtopic('quiz-${uniqueId}')">Bài kiểm tra</a>
            </div>
          </div>
          <div class="subtopic" id="assignment-${uniqueId}">
            <div class="subtopic-header" onclick="toggleSubtopic(this)">
              <i class="fas fa-chevron-down"></i> Bài tập
            </div>
            <div class="subtopic-content">
              <p class="assignment">Chưa có nội dung</p>
              <p>Không có tệp đính kèm</p>
            </div>
            <div class="subtopic-links">
              <a href="#video-${uniqueId}" onclick="scrollToSubtopic('video-${uniqueId}')">Video bài giảng</a>
              <a href="#quiz-${uniqueId}" onclick="scrollToSubtopic('quiz-${uniqueId}')">Bài kiểm tra</a>
            </div>
          </div>
          <div class="subtopic" id="quiz-${uniqueId}">
            <div class="subtopic-header" onclick="toggleSubtopic(this)">
              <i class="fas fa-chevron-down"></i> Bài kiểm tra
            </div>
            <div class="subtopic-content">
              <p class="quiz">Chưa có</p>
            </div>
            <div class="subtopic-links">
              <a href="#video-${uniqueId}" onclick="scrollToSubtopic('video-${uniqueId}')">Video bài giảng</a>
              <a href="#assignment-${uniqueId}" onclick="scrollToSubtopic('assignment-${uniqueId}')">Bài tập</a>
            </div>
          </div>
          <div class="actions">
            <div class="edit-btn" onclick="openEditModal(this.closest('.syllabus-item'))">
              <i class="fas fa-edit"></i>
            </div>
            <div class="delete-btn" onclick="clearSyllabusItemContent(this.closest('.syllabus-item'))">
              <i class="fas fa-trash"></i>
            </div>
          </div>
        `;
      }
    }

    function openModuleModal() {
      document.getElementById('addModuleModal').style.display = 'block';
    }

    function closeModuleModal() {
      document.getElementById('addModuleModal').style.display = 'none';
    }

    function openItemModal() {
      document.getElementById('addItemModal').style.display = 'block';
      updateItemForm();
    }

    function closeItemModal() {
      document.getElementById('addItemModal').style.display = 'none';
    }

    function addModule() {
      const moduleName = document.getElementById('moduleName').value;
      if (moduleName) {
        closeModuleModal();
        openItemModal();
      } else {
        alert('Vui lòng nhập tên học phần!');
      }
    }

    function updateItemForm() {
      const itemType = document.getElementById('itemType').value;
      const itemForm = document.getElementById('itemForm');
      let content = '';

      if (itemType === 'Bài Tập') {
        content = `
          <div class="input-container">
            <textarea id="itemContent" placeholder="Nhập nội dung bài tập">[ Tạo Bài Tập ]
Bài tập</textarea>
            <div class="add-icon" onclick="postItem('Bài Tập')"><i class="fas fa-plus"></i></div>
          </div>
        `;
      } else if (itemType === 'Kiểm Tra') {
        content = `
          <div class="input-container">
            <input type="text" id="itemContent" class="item-name" placeholder="Nhập liên kết kiểm tra (Ví dụ: https://example.com)">
            <div class="add-icon" onclick="postItem('Kiểm Tra')"><i class="fas fa-plus"></i></div>
          </div>
        `;
      } else {
        content = `
          <textarea id="itemContent" placeholder="Nhập nội dung cho ${itemType}">[ Tạo ${itemType} ]
${itemType}</textarea>
        `;
      }

      itemForm.innerHTML = content;
    }

    function postItem(itemType) {
      const itemContent = document.getElementById('itemContent').value;
      const itemList = document.getElementById('itemList');

      if (itemContent) {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';

        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';

        const icon = document.createElement('i');
        if (itemType === 'Bài Tập') {
          icon.className = 'fas fa-book';
        } else if (itemType === 'Kiểm Tra') {
          icon.className = 'fas fa-check-square';
        } else if (itemType === 'Tập Tin') {
          icon.className = 'fas fa-file-alt';
        } else if (itemType === 'Thảo Luận') {
          icon.className = 'fas fa-comments';
        }

        const itemNameSpan = document.createElement('span');
        itemNameSpan.textContent = `${itemType}`;

        itemInfo.appendChild(icon);
        itemInfo.appendChild(itemNameSpan);
        itemCard.appendChild(itemInfo);

        const itemContentDiv = document.createElement('div');
        itemContentDiv.className = 'item-content';
        if (itemType === 'Bài Tập') {
          itemContentDiv.textContent = itemContent;
        } else if (itemType === 'Kiểm Tra') {
          const link = document.createElement('a');
          link.href = itemContent;
          link.textContent = itemContent;
          link.target = '_blank';
          itemContentDiv.appendChild(link);
        }
        itemCard.appendChild(itemContentDiv);

        itemList.appendChild(itemCard);

        document.getElementById('itemContent').value = '';
      } else {
        alert('Vui lòng nhập nội dung cho mục!');
      }
    }

    function addItem() {
      const itemType = document.getElementById('itemType').value;
      const itemContent = document.getElementById('itemContent').value;
      const itemList = document.getElementById('itemList');

      if (itemContent) {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';

        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';

        const icon = document.createElement('i');
        if (itemType === 'Bài Tập') {
          icon.className = 'fas fa-book';
        } else if (itemType === 'Kiểm Tra') {
          icon.className = 'fas fa-check-square';
        } else if (itemType === 'Tập Tin') {
          icon.className = 'fas fa-file-alt';
        } else if (itemType === 'Thảo Luận') {
          icon.className = 'fas fa-comments';
        }
        const itemNameSpan = document.createElement('span');
        itemNameSpan.textContent = `${itemType}`;

        itemInfo.appendChild(icon);
        itemInfo.appendChild(itemNameSpan);
        itemCard.appendChild(itemInfo);

        const itemContentDiv = document.createElement('div');
        itemContentDiv.className = 'item-content';
        if (itemType === 'Bài Tập') {
          itemContentDiv.textContent = itemContent;
        } else if (itemType === 'Kiểm Tra') {
          const link = document.createElement('a');
          link.href = itemContent;
          link.textContent = itemContent;
          link.target = '_blank';
          itemContentDiv.appendChild(link);
        } else {
          itemContentDiv.textContent = itemContent;
        }
        itemCard.appendChild(itemContentDiv);

        itemList.appendChild(itemCard);
        closeItemModal();
      } else {
        alert('Vui lòng nhập nội dung cho mục!');
      }
    }