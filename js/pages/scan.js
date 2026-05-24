// js/pages/scan.js — AI 掃描辨識頁

let scanning = false;
let autoScanEnabled = false;
let countdownInterval = null;
let countdownSec = 3;

function renderScan(container) {
  scanning = false;
  autoScanEnabled = false;
  clearCountdown();

  container.innerHTML = `
    <div class="scan-layout">
      <div class="cam-frame" id="cam-frame">
        <div class="scan-line"></div>

        <!-- 倒計時顯示：正上方中間 -->
        <div id="auto-countdown" style="
          display:none;
          position:absolute;
          top:18px;
          left:50%;
          transform:translateX(-50%);
          z-index:20;
          text-align:center;
        ">
          <div style="
            background:rgba(0,0,0,.55);
            backdrop-filter:blur(6px);
            border-radius:999px;
            padding:6px 20px;
            display:flex;
            align-items:center;
            gap:8px;
          ">
            <span style="color:#4ade80;font-size:11px;font-weight:700;letter-spacing:1px">AUTO</span>
            <span id="countdown-num" style="
              font-family:'Syne',sans-serif;
              font-size:22px;
              font-weight:800;
              color:#fff;
              min-width:24px;
              text-align:center;
              line-height:1;
            ">3</span>
            <span style="color:#4ade80;font-size:11px;font-weight:700;letter-spacing:1px">s</span>
          </div>
        </div>

        <div class="cam-ph">
          <div class="cam-ph-icon">📷</div>
          <div class="cam-ph-text">CAMERA FEED</div>
        </div>
        <video id="cam-video" autoplay playsinline muted
          style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none"></video>
        <div class="scanning-overlay" id="scanning-overlay">
          <div class="scan-ring"></div>
        </div>
      </div>

      <div class="scan-panel">
        <div class="scan-idle" id="scan-idle">
          <div class="scan-idle-icon">📷</div>
          <div class="scan-idle-title">reloop Vision AI</div>
          <div class="scan-idle-sub">將垃圾放在鏡頭前，<br/>按下按鈕開始辨識</div>
          <button class="scan-btn" id="scan-btn" onclick="startScan()">啟動辨識</button>
        </div>

        <!-- 自動辨識開關 -->
        <div class="auto-scan-row" id="auto-scan-row">
          <div class="auto-scan-info">
            <div class="auto-scan-title">🤖 自動辨識模式</div>
            <div class="auto-scan-sub" id="auto-scan-sub">開啟後每 3 秒自動掃描一次</div>
          </div>
          <label class="toggle-wrap" style="margin:0">
            <input type="checkbox" id="auto-scan-toggle" onchange="toggleAutoScan(this.checked)"/>
            <span class="toggle"></span>
          </label>
        </div>

        <div class="scan-result" id="scan-result">
          <div class="result-type">金屬罐（Aluminum Can）</div>
          <div class="result-grid">
            <div class="result-stat">
              <div class="result-stat-label">Confidence</div>
              <div class="result-stat-val">99.2%</div>
            </div>
            <div class="result-stat green">
              <div class="result-stat-label">Reward</div>
              <div class="result-stat-val">+25 CCN</div>
            </div>
          </div>
          <div style="background:#f0fdf4;border-radius:12px;padding:14px;font-size:12.5px;color:#166534;margin-bottom:16px;line-height:1.6">
            💡 請確認罐內已排空，並盡量壓扁以利存放。
          </div>
          <div class="result-actions">
            <button class="btn-retry" onclick="resetScan()">重試</button>
            <button class="btn-confirm" onclick="confirmScan()">確認投入系統 ✓</button>
          </div>
        </div>
      </div>
    </div>
  `;

  startCamera();
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById('cam-video');
    if (!video) return;
    video.srcObject = stream;
    video.style.display = 'block';
    const ph = document.querySelector('.cam-ph');
    if (ph) ph.style.display = 'none';
  } catch (e) {
    console.log('Camera unavailable:', e.message);
  }
}

function toggleAutoScan(enabled) {
  autoScanEnabled = enabled;
  clearCountdown();
  const sub = document.getElementById('auto-scan-sub');
  if (enabled) {
    if (sub) sub.textContent = '自動掃描進行中...';
    runAutoCountdown();
  } else {
    if (sub) sub.textContent = '開啟後每 3 秒自動掃描一次';
  }
}

function runAutoCountdown() {
  if (!autoScanEnabled || scanning) return;

  countdownSec = 3;
  const countdownEl = document.getElementById('auto-countdown');
  const numEl = document.getElementById('countdown-num');
  if (!countdownEl || !numEl) return;

  numEl.textContent = countdownSec;
  countdownEl.style.display = 'block';

  countdownInterval = setInterval(() => {
    countdownSec--;
    const n = document.getElementById('countdown-num');
    if (n) n.textContent = countdownSec;

    if (countdownSec <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      const el = document.getElementById('auto-countdown');
      if (el) el.style.display = 'none';
      // 實際觸發掃描
      if (autoScanEnabled && !scanning) {
        startScan(true);
      }
    }
  }, 1000);
}

function clearCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  const el = document.getElementById('auto-countdown');
  if (el) el.style.display = 'none';
}

function startScan(fromAuto) {
  if (scanning) return;
  scanning = true;
  clearCountdown();

  const btn = document.getElementById('scan-btn');
  if (btn) btn.disabled = true;
  const overlay = document.getElementById('scanning-overlay');
  if (overlay) overlay.classList.add('active');

  setTimeout(() => {
    if (overlay) overlay.classList.remove('active');
    const idle = document.getElementById('scan-idle');
    const autoRow = document.getElementById('auto-scan-row');
    const result = document.getElementById('scan-result');
    if (idle) idle.style.display = 'none';
    if (autoRow) autoRow.style.display = 'none';
    if (result) result.classList.add('show');
    scanning = false;
  }, 2200);
}

function resetScan() {
  scanning = false;
  const idle = document.getElementById('scan-idle');
  const autoRow = document.getElementById('auto-scan-row');
  const result = document.getElementById('scan-result');
  const btn = document.getElementById('scan-btn');
  if (idle) idle.style.display = '';
  if (autoRow) autoRow.style.display = '';
  if (result) result.classList.remove('show');
  if (btn) btn.disabled = false;

  // 若自動模式仍開著，重新倒計時
  if (autoScanEnabled) {
    setTimeout(() => runAutoCountdown(), 300);
  }
}

function confirmScan() {
  autoScanEnabled = false;
  clearCountdown();
  scanning = false;
  const toggle = document.getElementById('auto-scan-toggle');
  if (toggle) toggle.checked = false;
  resetScan();
  switchPage('dashboard');
}
