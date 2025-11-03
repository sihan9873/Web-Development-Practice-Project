(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('#primary-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.setAttribute('aria-expanded', String(!expanded));
    });
  }

  const yearSpan = document.querySelector('#year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const form = document.querySelector('#message-form');
  const list = document.querySelector('#message-list');
  const storageKey = 'xinghui-messages';
  const resumeForm = document.querySelector('#resume-form');
  const resumeList = document.querySelector('#resume-list');
  const applyButtons = document.querySelectorAll('.apply-btn');
  const resumeStorageKey = 'xinghui-resumes';

  const renderMessages = (messages) => {
    if (!list) return;

    list.innerHTML = '';

    if (!messages.length) {
      const empty = document.createElement('li');
      empty.className = 'message-empty';
      empty.textContent = '暂时还没有留言，快来抢沙发！';
      list.appendChild(empty);
      return;
    }

    messages.forEach(({ name, message, createdAt }) => {
      const item = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = `${name} · ${new Date(createdAt).toLocaleString()}`;
      const paragraph = document.createElement('p');
      paragraph.textContent = message;
      item.appendChild(strong);
      item.appendChild(paragraph);
      list.appendChild(item);
    });
  };

  const loadMessages = () => {
    try {
      const messages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(messages) ? messages : [];
    } catch (error) {
      console.warn('加载留言失败：', error);
      return [];
    }
  };

  const saveMessages = (messages) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.warn('保存留言失败：', error);
    }
  };

  if (form && list) {
    let messages = loadMessages();
    renderMessages(messages);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('#guest-name');
      const message = form.querySelector('#guest-message');

      if (!name || !message) return;

      const trimmedName = name.value.trim();
      const trimmedMessage = message.value.trim();

      if (!trimmedName || !trimmedMessage) {
        alert('请填写完整的姓名和留言内容');
        return;
      }

      const newMessage = {
        name: trimmedName,
        message: trimmedMessage,
        createdAt: Date.now(),
      };

      messages = [newMessage, ...messages].slice(0, 100);
      saveMessages(messages);
      renderMessages(messages);

      form.reset();
    });
  }

  const renderResumes = (resumes) => {
    if (!resumeList) return;

    resumeList.innerHTML = '';

    if (!resumes.length) {
      const empty = document.createElement('li');
      empty.className = 'resume-empty';
      empty.textContent = '暂未提交投递记录，点击岗位卡片立即申请。';
      resumeList.appendChild(empty);
      return;
    }

    resumes.forEach(({ name, email, phone, position, resumeLink, intro, createdAt }) => {
      const item = document.createElement('li');
      item.className = 'resume-item';

      const header = document.createElement('div');
      header.className = 'resume-item-header';

      const title = document.createElement('strong');
      title.textContent = `${name} · ${position}`;

      const meta = document.createElement('span');
      meta.className = 'resume-meta';
      meta.textContent = `${new Date(createdAt).toLocaleString()} · ${phone}`;

      header.appendChild(title);
      header.appendChild(meta);

      const link = document.createElement('a');
      link.href = resumeLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'resume-item-link';
      link.textContent = resumeLink;

      const introParagraph = document.createElement('p');
      introParagraph.textContent = intro;

      const contact = document.createElement('p');
      contact.className = 'resume-meta';
      contact.textContent = `联系邮箱：${email}`;

      item.appendChild(header);
      item.appendChild(link);
      item.appendChild(introParagraph);
      item.appendChild(contact);

      resumeList.appendChild(item);
    });
  };

  const loadResumes = () => {
    try {
      const resumes = JSON.parse(localStorage.getItem(resumeStorageKey) || '[]');
      return Array.isArray(resumes) ? resumes : [];
    } catch (error) {
      console.warn('加载投递记录失败：', error);
      return [];
    }
  };

  const saveResumes = (resumes) => {
    try {
      localStorage.setItem(resumeStorageKey, JSON.stringify(resumes));
    } catch (error) {
      console.warn('保存投递记录失败：', error);
    }
  };

  if (resumeForm && resumeList) {
    const positionField = resumeForm.querySelector('#candidate-position');
    const firstField = resumeForm.querySelector('input, select, textarea');
    let resumes = loadResumes();
    renderResumes(resumes);

    resumeForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameField = resumeForm.querySelector('#candidate-name');
      const emailField = resumeForm.querySelector('#candidate-email');
      const phoneField = resumeForm.querySelector('#candidate-phone');
      const linkField = resumeForm.querySelector('#candidate-resume');
      const introField = resumeForm.querySelector('#candidate-intro');

      if (!nameField || !emailField || !phoneField || !positionField || !linkField || !introField) {
        return;
      }

      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const phone = phoneField.value.trim();
      const position = positionField.value.trim();
      const resumeLink = linkField.value.trim();
      const intro = introField.value.trim();

      if (!name || !email || !phone || !position || !resumeLink || !intro) {
        alert('请完整填写所有信息后再提交');
        return;
      }

      const newResume = {
        name,
        email,
        phone,
        position,
        resumeLink,
        intro,
        createdAt: Date.now(),
      };

      resumes = [newResume, ...resumes].slice(0, 50);
      saveResumes(resumes);
      renderResumes(resumes);
      resumeForm.reset();
      positionField.value = position;
      if (firstField instanceof HTMLElement) {
        firstField.focus();
      }
      alert('投递成功！我们会尽快与您联系。');
    });

    applyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const position = button.getAttribute('data-position') || '';
        if (positionField) {
          positionField.value = position;
        }
        resumeForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          if (firstField instanceof HTMLElement) {
            firstField.focus();
          }
        }, 350);
      });
    });
  }
})();

