// js/main.js — 初始化入口

document.addEventListener('DOMContentLoaded', () => {

  // 登入表單送出
  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('auth-submit');
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value.trim();

    submitBtn.disabled = true;
    showAuthMessage('正在連線後端...', 'success');

    try {
      const data = isRegister
        ? await apiRequest('/api/auth/register', {
            method: 'POST',
            body: { name, email, password }
          })
        : await apiRequest('/api/auth/login', {
            method: 'POST',
            body: { email, password }
          });

      setSession(data);
      document.getElementById('auth-screen').style.display = 'none';
      document.getElementById('app').style.display = 'flex';
      switchPage('dashboard');
    } catch (error) {
      showAuthMessage(`登入失敗：${error.message}`);
    } finally {
      submitBtn.disabled = false;
    }
  });

  // 🚀 【更新】側邊導覽與手機版底欄聯合綁定
  // 同時抓取電腦版 (.nav-item) 與 手機版 (.mobile-nav-item)
  const allNavButtons = document.querySelectorAll('.nav-item, .mobile-nav-item');

  allNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPage = btn.dataset.page;
      
      // 1. 切換到目標頁面
      switchPage(targetPage);

      // 2. 移除所有按鈕的 active 狀態（不論是電腦版還是手機版）
      allNavButtons.forEach(b => b.classList.remove('active'));

      // 3. 讓對應到該頁面的按鈕通通亮起來（完美同步）
      document.querySelectorAll(`[data-page="${targetPage}"]`).forEach(matchBtn => {
        matchBtn.classList.add('active');
      });
    });
  });

  const session = getSession();
  if (session?.token) {
    updateUserBadge(session.user);
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    switchPage('dashboard');
  }
});