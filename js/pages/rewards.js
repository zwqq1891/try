// js/pages/rewards.js — 獎勵中心頁

function renderRewards(container) {
  container.innerHTML = `
    <div class="rewards-header">
      <div class="rewards-title">獎勵中心</div>
      <div class="coin-balance" id="reward-balance">⚡ 餘額：-- CCN</div>
    </div>
    <div class="rewards-grid" id="rewards-grid">
      <div class="inline-muted">正在讀取獎勵商品...</div>
    </div>
  `;

  loadRewards();
}

function rewardIcon(name) {
  if (name.includes('咖啡')) return '☕';
  if (name.includes('購物袋')) return '🛍';
  if (name.includes('樹')) return '🌱';
  if (name.includes('超商')) return '🎁';
  if (name.includes('單車')) return '🚲';
  return '♻';
}

async function loadRewards() {
  try {
    const [summary, data] = await Promise.all([
      apiRequest('/api/summary'),
      apiRequest('/api/rewards')
    ]);
    document.getElementById('reward-balance').textContent =
      `⚡ 餘額：${Number(summary.carbonCoins).toLocaleString()} CCN`;

    document.getElementById('rewards-grid').innerHTML = data.rewards.map(r => `
      <div class="reward-card">
        <div class="reward-icon">${rewardIcon(r.name)}</div>
        <div class="reward-name">${r.name}</div>
        <div class="reward-desc">${r.description}</div>
        <div class="reward-cost">⚡ ${Number(r.cost).toLocaleString()} CCN</div>
        <button class="btn-reward" onclick="redeemReward(${r.id}, '${r.name.replace(/'/g, "\\'")}')">立即兌換</button>
      </div>
    `).join('');
  } catch (error) {
    document.getElementById('rewards-grid').innerHTML =
      `<div class="inline-error">讀取獎勵中心失敗：${error.message}</div>`;
  }
}

async function redeemReward(id, name) {
  try {
    const data = await apiRequest(`/api/rewards/${id}/redeem`, { method: 'POST' });
    alert(`已兌換：${data.reward}\n扣除 ${Number(data.cost).toLocaleString()} CCN`);
    loadRewards();
  } catch (error) {
    alert(`兌換失敗：${error.message}`);
  }
}
