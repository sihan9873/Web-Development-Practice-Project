// 更新导航栏用户状态（通用脚本）
(async function updateNavbarAuth() {
  const authButtons = document.getElementById('auth-buttons');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');

  if (!authButtons || !userMenu) return;

  try {
    // 尝试加载 API 客户端（如果存在）
    if (typeof checkAuth === 'function' && typeof apiClient !== 'undefined') {
      const user = await checkAuth();
      if (user) {
        // 已登录：显示用户菜单
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        if (userName) userName.textContent = user.name || user.email;
        
        // 退出登录
        if (logoutBtn) {
          logoutBtn.addEventListener('click', async () => {
            if (confirm('确定要退出登录吗？')) {
              await apiClient.logout();
            }
          });
        }
      } else {
        // 未登录：显示登录/注册按钮
        authButtons.style.display = 'block';
        userMenu.style.display = 'none';
      }
    } else {
      // API 不可用，显示登录按钮（兼容纯前端模式）
      authButtons.style.display = 'block';
      userMenu.style.display = 'none';
    }
  } catch (error) {
    // 出错时显示登录按钮
    authButtons.style.display = 'block';
    userMenu.style.display = 'none';
  }
})();


