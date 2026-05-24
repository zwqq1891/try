// js/pages/dashboard.js — 控制主頁

function renderDashboard(container) {
  container.innerHTML = `
    <div class="stats-grid">
      <div class="card card-dark">
        <div class="stat-icon" style="background:rgba(255,255,255,.1)">⚡</div>
        <div class="stat-label" style="color:#fff">碳幣餘額</div>
        <div class="stat-value">12,840 <span class="stat-unit">CCN</span></div>
      </div>
      <div class="card">
        <div class="stat-icon" style="background:#eff6ff">📦</div>
        <div class="stat-label">本月回收</div>
        <div class="stat-value">42.5 <span class="stat-unit">KG</span></div>
        <div class="stat-trend trend-up">+15%</div>
      </div>
      <div class="card">
        <div class="stat-icon" style="background:#dcfce7">🌱</div>
        <div class="stat-label">碳足跡減少</div>
        <div class="stat-value">156.8 <span class="stat-unit">KG CO₂</span></div>
        <div class="stat-trend trend-down">-8.2%</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:20px">
      <div class="card">
        <div class="card-title">垃圾產量預測（reloop AI）</div>
        <div class="bars">
          ${[
            {h:35,label:'Day1',color:'var(--border)'},
            {h:55,label:'Day2',color:'var(--border)'},
            {h:30,label:'Day3',color:'var(--border)'},
            {h:70,label:'Day4',color:'var(--border)'},
            {h:45,label:'Day5',color:'var(--border)'},
            {h:25,label:'Day6',color:'var(--border)'},
            {h:28,label:'Today',color:'#16a34a'}
          ].map(b => `
            <div class="bar-wrap">
              <div class="bar-bg">
                <div class="bar" style="background:${b.color};height:${b.h}%"></div>
              </div>
              <div class="bar-label">${b.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="advice-card">
        <div>
          <div class="advice-icon">⚠️</div>
          <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:10px">reloop 智慧建議</div>
          <div class="advice-text">偵測到本週外送包裝比例過高，建議更換可重複餐具以增加 CCN 累積速度。</div>
        </div>
        <button class="advice-btn">優化回收計畫 →</button>
      </div>
    </div>

    <div class="activity-card">
      <div class="activity-header">reloop 活動日誌</div>
      <table class="tbl">
        <thead>
          <tr>
            <th>時間</th>
            <th>回收品項</th>
            <th style="text-align:right">獲得點數</th>
          </tr>
        </thead>
        <tbody>
          ${[
            {time:'14:20', name:'鋁罐回收套組', pts:'+45 CCN'},
            {time:'11:05', name:'PET 塑膠瓶',   pts:'+75 CCN'},
            {time:'09:33', name:'紙板紙盒',       pts:'+30 CCN'},
            {time:'昨天',  name:'玻璃罐回收',     pts:'+20 CCN'}
          ].map(r => `
            <tr>
              <td style="color:var(--muted);font-size:13px">${r.time}</td>
              <td style="font-weight:600">${r.name}</td>
              <td class="points-badge">${r.pts}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
