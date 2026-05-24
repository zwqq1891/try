// js/main.js — 初始化入口

document.addEventListener('DOMContentLoaded', () => {

  // 登入表單送出
  document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    switchPage('dashboard');
  });

  // 側邊導覽綁定
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.page));
  });

});
