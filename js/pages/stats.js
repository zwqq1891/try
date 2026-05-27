// js/pages/stats.js — 回收統計趨勢頁

function renderStats(container) {
  container.innerHTML = `
    <div class="stats-grid">
      <div class="card">
        <div class="stat-icon" style="background:#eff6ff">📦</div>
        <div class="stat-label">本月回收</div>
        <div class="stat-value" id="stats-recycled">-- <span class="stat-unit">KG</span></div>
      </div>
      <div class="card">
        <div class="stat-icon" style="background:#dcfce7">🌱</div>
        <div class="stat-label">本月減碳</div>
        <div class="stat-value" id="stats-carbon">-- <span class="stat-unit">KG CO₂</span></div>
      </div>
      <div class="card card-dark">
        <div class="stat-icon" style="background:rgba(255,255,255,.1)">⚡</div>
        <div class="stat-label" style="color:#fff">碳幣餘額</div>
        <div class="stat-value" id="stats-coins">-- <span class="stat-unit">CCN</span></div>
      </div>
    </div>

    <div class="activity-card">
      <div class="activity-header">回收紀錄明細</div>
      <table class="tbl">
        <thead>
          <tr>
            <th>時間</th>
            <th>品項</th>
            <th>大小 / 清潔度</th>
            <th style="text-align:right">點數</th>
          </tr>
        </thead>
        <tbody id="stats-records">
          <tr><td colspan="4" class="inline-muted">正在讀取資料...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  loadStats();
}

async function loadStats() {
  try {
    const [summary, data] = await Promise.all([
      apiRequest('/api/summary'),
      apiRequest('/api/records')
    ]);

    document.getElementById('stats-recycled').innerHTML =
      `${Number(summary.monthlyRecycledKg).toFixed(2)} <span class="stat-unit">KG</span>`;
    document.getElementById('stats-carbon').innerHTML =
      `${Number(summary.monthlyCarbonReducedKg).toFixed(2)} <span class="stat-unit">KG CO₂</span>`;
    document.getElementById('stats-coins').innerHTML =
      `${Number(summary.carbonCoins).toLocaleString()} <span class="stat-unit">CCN</span>`;

    const rows = document.getElementById('stats-records');
    if (!data.records.length) {
      rows.innerHTML = '<tr><td colspan="4" class="inline-muted">目前還沒有回收紀錄。</td></tr>';
      return;
    }

    rows.innerHTML = data.records.map(record => `
      <tr>
        <td style="color:var(--muted);font-size:13px">${new Date(record.created_at).toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
        <td style="font-weight:600">${record.item_name}<br><span style="color:var(--muted);font-size:12px">${record.material}</span></td>
        <td>${record.size} / ${record.cleanliness}</td>
        <td class="points-badge">+${record.points_earned} CCN</td>
      </tr>
    `).join('');
  } catch (error) {
    document.getElementById('stats-records').innerHTML =
      `<tr><td colspan="4"><div class="inline-error">讀取統計資料失敗：${error.message}</div></td></tr>`;
  }
}
