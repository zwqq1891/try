// js/auth.js — 登入/註冊切換邏輯

let isRegister = false;

function toggleAuth() {
  isRegister = !isRegister;
  document.getElementById('auth-title').textContent = isRegister ? '建立 reloop 帳號' : '歡迎回到 reloop';
  document.getElementById('auth-sub2').textContent = isRegister ? '開始您的環保旅程，僅需幾秒鐘' : '請登入您的帳號以查看回收數據';
  document.getElementById('auth-submit').textContent = isRegister ? '立即註冊' : '進入系統';
  document.getElementById('auth-switch-text').textContent = isRegister ? '已經有帳號了？' : '還沒有帳號嗎？';
  document.getElementById('auth-switch-btn').textContent = isRegister ? '登入帳號' : '註冊 reloop';
}

function logout() {
  document.getElementById('app').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  toggleSettings(true);
}
