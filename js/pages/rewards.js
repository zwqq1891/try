// js/pages/rewards.js — 獎勵中心頁

const REWARDS = [
  { icon:'☕', name:'星巴克咖啡折抵券', desc:'買一杯指定飲品折抵 $50',    cost: 500  },
  { icon:'🛍️', name:'環保購物袋',       desc:'reloop 限定環保帆布包',     cost: 1200 },
  { icon:'🌱', name:'種一棵樹計畫',     desc:'捐助台灣造林協會植樹',       cost: 800  },
  { icon:'🎁', name:'超商購物金 $100',  desc:'全家 / 7-11 現金折抵',      cost: 2000 },
  { icon:'🚲', name:'共享單車月票',      desc:'YouBike 30 天無限次騎乘',   cost: 1500 },
  { icon:'♻️', name:'回收加倍活動票',   desc:'下次回收點數 x2 兌換券',    cost: 300  },
];

function renderRewards(container) {
  container.innerHTML = `
    <div class="rewards-header">
      <div class="rewards-title">獎勵中心</div>
      <div class="coin-balance">⚡ 餘額：12,840 CCN</div>
    </div>
    <div class="rewards-grid">
      ${REWARDS.map(r => `
        <div class="reward-card">
          <div class="reward-icon">${r.icon}</div>
          <div class="reward-name">${r.name}</div>
          <div class="reward-desc">${r.desc}</div>
          <div class="reward-cost">⚡ ${r.cost.toLocaleString()} CCN</div>
          <button class="btn-reward" onclick="redeemReward('${r.name}', ${r.cost})">立即兌換</button>
        </div>
      `).join('')}
    </div>
  `;
}

function redeemReward(name, cost) {
  alert(`✅ 已兌換：${name}\n扣除 ${cost.toLocaleString()} CCN`);
}
