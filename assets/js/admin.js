(() => {
  const resumeStorageKey = 'xinghui-resumes';
  let allResumes = [];
  let filteredResumes = [];

  const yearSpan = document.querySelector('#year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

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
      return true;
    } catch (error) {
      console.warn('保存投递记录失败：', error);
      return false;
    }
  };

  const updateStats = () => {
    const total = allResumes.length;
    const filtered = filteredResumes.length;
    const positions = new Set(allResumes.map(r => r.position)).size;
    const today = new Date().toDateString();
    const todayCount = allResumes.filter(r => new Date(r.createdAt).toDateString() === today).length;

    document.getElementById('total-count').textContent = total;
    document.getElementById('filtered-count').textContent = filtered;
    document.getElementById('position-count').textContent = positions;
    document.getElementById('today-count').textContent = todayCount;
  };

  const renderTable = () => {
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (filteredResumes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">暂无数据</td></tr>';
      return;
    }

    filteredResumes.forEach((resume, index) => {
      const row = document.createElement('tr');
      const date = new Date(resume.createdAt).toLocaleString('zh-CN');

      row.innerHTML = `
        <td><strong>${escapeHtml(resume.name)}</strong></td>
        <td>${escapeHtml(resume.position)}</td>
        <td><a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></td>
        <td><a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a></td>
        <td><a href="${escapeHtml(resume.resumeLink)}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); word-break: break-all;">查看简历</a></td>
        <td>${date}</td>
        <td class="action-buttons">
          <button class="btn btn-small secondary view-detail" data-index="${index}">详情</button>
          <button class="btn btn-small btn-danger delete-resume" data-index="${index}">删除</button>
        </td>
      `;

      tbody.appendChild(row);
    });

    document.querySelectorAll('.view-detail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        showDetail(filteredResumes[index]);
      });
    });

    document.querySelectorAll('.delete-resume').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        const resume = filteredResumes[index];
        if (confirm(`确定要删除 ${resume.name} 的投递记录吗？`)) {
          deleteResume(resume);
        }
      });
    });
  };

  const showDetail = (resume) => {
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;

    const date = new Date(resume.createdAt).toLocaleString('zh-CN');
    content.innerHTML = `
      <div class="form-row">
        <label><strong>姓名：</strong></label>
        <p>${escapeHtml(resume.name)}</p>
      </div>
      <div class="form-row">
        <label><strong>职位：</strong></label>
        <p>${escapeHtml(resume.position)}</p>
      </div>
      <div class="form-row">
        <label><strong>邮箱：</strong></label>
        <p><a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></p>
      </div>
      <div class="form-row">
        <label><strong>电话：</strong></label>
        <p><a href="tel:${escapeHtml(resume.phone)}">${escapeHtml(resume.phone)}</a></p>
      </div>
      <div class="form-row">
        <label><strong>简历链接：</strong></label>
        <p><a href="${escapeHtml(resume.resumeLink)}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); word-break: break-all;">${escapeHtml(resume.resumeLink)}</a></p>
      </div>
      <div class="form-row">
        <label><strong>自我介绍：</strong></label>
        <p style="white-space: pre-wrap;">${escapeHtml(resume.intro)}</p>
      </div>
      <div class="form-row">
        <label><strong>投递时间：</strong></label>
        <p>${date}</p>
      </div>
    `;

    modal.style.display = 'flex';
  };

  const deleteResume = (resume) => {
    allResumes = allResumes.filter(r => r.createdAt !== resume.createdAt || r.name !== resume.name);
    saveResumes(allResumes);
    applyFilters();
  };

  const applyFilters = () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const positionFilter = document.getElementById('position-filter').value;
    const sortBy = document.getElementById('sort-by').value;

    filteredResumes = allResumes.filter(resume => {
      const matchSearch = !searchTerm || 
        resume.name.toLowerCase().includes(searchTerm) ||
        resume.email.toLowerCase().includes(searchTerm) ||
        resume.phone.includes(searchTerm) ||
        resume.position.toLowerCase().includes(searchTerm) ||
        resume.intro.toLowerCase().includes(searchTerm);
      
      const matchPosition = !positionFilter || resume.position === positionFilter;

      return matchSearch && matchPosition;
    });

    filteredResumes.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'name':
          return a.name.localeCompare(b.name, 'zh-CN');
        case 'newest':
        default:
          return b.createdAt - a.createdAt;
      }
    });

    updateStats();
    renderTable();
  };

  const updatePositionFilter = () => {
    const filter = document.getElementById('position-filter');
    if (!filter) return;

    const positions = Array.from(new Set(allResumes.map(r => r.position))).sort();
    const currentValue = filter.value;

    filter.innerHTML = '<option value="">全部职位</option>';
    positions.forEach(pos => {
      const option = document.createElement('option');
      option.value = pos;
      option.textContent = pos;
      filter.appendChild(option);
    });

    filter.value = currentValue;
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(filteredResumes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumes_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = ['姓名', '职位', '邮箱', '电话', '简历链接', '自我介绍', '投递时间'];
    const rows = filteredResumes.map(r => [
      r.name,
      r.position,
      r.email,
      r.phone,
      r.resumeLink,
      r.intro.replace(/\n/g, ' '),
      new Date(r.createdAt).toLocaleString('zh-CN')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (confirm('确定要清空所有投递记录吗？此操作不可恢复！')) {
      if (confirm('请再次确认：这将永久删除所有数据！')) {
        localStorage.removeItem(resumeStorageKey);
        allResumes = [];
        applyFilters();
        alert('已清空所有数据');
      }
    }
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const init = () => {
    allResumes = loadResumes();
    updatePositionFilter();
    applyFilters();

    document.getElementById('search-input').addEventListener('input', applyFilters);
    document.getElementById('position-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-by').addEventListener('change', applyFilters);
    document.getElementById('export-json').addEventListener('click', exportJSON);
    document.getElementById('export-csv').addEventListener('click', exportCSV);
    document.getElementById('clear-all').addEventListener('click', clearAll);
    document.getElementById('close-modal').addEventListener('click', () => {
      document.getElementById('detail-modal').style.display = 'none';
    });

    document.getElementById('detail-modal').addEventListener('click', (e) => {
      if (e.target.id === 'detail-modal') {
        e.target.style.display = 'none';
      }
    });
  };

  init();
})();


