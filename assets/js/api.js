// API 配置
const API_BASE_URL = 'http://localhost:3000/api';

// API 客户端类
class ApiClient {
  constructor() {
    this.token = localStorage.getItem('auth_token') || null;
  }

  // 设置认证令牌
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // 获取认证头
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      // 处理响应不是 JSON 的情况
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`服务器返回了非 JSON 响应: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `请求失败 (${response.status})`);
      }

      return data;
    } catch (error) {
      console.error('API 请求失败:', error);
      
      // 提供更友好的错误信息
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('无法连接到服务器。请确保后端服务器已启动（运行 npm start）');
      }
      
      // 如果是网络错误
      if (!navigator.onLine) {
        throw new Error('网络连接已断开，请检查您的网络连接');
      }
      
      // 其他错误
      throw error;
    }
  }

  // 认证相关
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async logout() {
    this.setToken(null);
    window.location.href = 'index.html';
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // 简历相关
  async submitResume(resumeData) {
    return this.request('/resumes', {
      method: 'POST',
      body: JSON.stringify(resumeData)
    });
  }

  async getResumes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/resumes?${queryString}`);
  }

  async getResume(id) {
    return this.request(`/resumes/${id}`);
  }

  async deleteResume(id) {
    return this.request(`/resumes/${id}`, {
      method: 'DELETE'
    });
  }

  async updateResumeStatus(id, status, notes) {
    return this.request(`/resumes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  }

  async getResumeStats() {
    return this.request('/resumes/stats/summary');
  }

  // 留言相关
  async submitMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  async getMessages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages?${queryString}`);
  }

  async updateMessage(id, data) {
    return this.request(`/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async deleteMessage(id) {
    return this.request(`/messages/${id}`, {
      method: 'DELETE'
    });
  }

  // 用户管理（仅管理员）
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  }
}

// 创建全局实例
const apiClient = new ApiClient();

// 检查登录状态
async function checkAuth() {
  try {
    if (apiClient.token) {
      const response = await apiClient.getCurrentUser();
      return response.data.user;
    }
  } catch (error) {
    apiClient.setToken(null);
  }
  return null;
}

// 需要登录的页面检查
async function requireAuth() {
  const user = await checkAuth();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

// 需要管理员权限的页面检查
async function requireAdmin() {
  const user = await requireAuth();
  if (user && user.role !== 'admin') {
    alert('需要管理员权限');
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

