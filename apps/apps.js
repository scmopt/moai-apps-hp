/* ========================================
   MOAI-Apps — Page Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTabs('apps');
  initInteractiveDemo();
});

// ---- 11 apps selector tabs ----
function initTabs(name) {
  const btns = document.querySelectorAll(`[data-tabs="${name}"] .tab-btn`);
  const panes = document.querySelectorAll(`[data-panes="${name}"] .tab-pane`);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-tab');
      btns.forEach(b => b.classList.toggle('active', b === btn));
      panes.forEach(p => p.classList.toggle('active', p.getAttribute('data-pane') === key));
    });
  });
}

// ---- In-browser demo (editable cells + solve) ----
function initInteractiveDemo() {
  const solveBtn = document.getElementById('demo-solve-btn');
  const resultImg = document.getElementById('demo-result-img');
  const statusBadge = document.getElementById('demo-status-badge');
  const metricTime = document.getElementById('demo-metric-time');
  const metricLoad = document.getElementById('demo-metric-load');
  const metricViolation = document.getElementById('demo-metric-violation');

  // Clicking an editable cell cycles its value and marks the result stale
  document.querySelectorAll('.editable-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const field = cell.getAttribute('data-field');
      if (field === 'weight') {
        const current = parseInt(cell.textContent, 10);
        const next = current >= 1500 ? 400 : current + 300;
        cell.textContent = next + ' kg';
      } else if (field === 'time') {
        const slots = ['09:00 - 12:00', '13:00 - 15:00', '15:00 - 18:00', '終日OK'];
        const idx = slots.indexOf(cell.textContent.trim());
        cell.textContent = slots[(idx + 1) % slots.length];
      }

      statusBadge.textContent = '要再計算（データ変更あり）';
      statusBadge.classList.add('stale');
    });
  });

  solveBtn.addEventListener('click', () => {
    solveBtn.disabled = true;
    solveBtn.textContent = '⏳ 最適化計算中 (VRP)...';
    resultImg.style.opacity = '0.35';

    setTimeout(() => {
      solveBtn.disabled = false;
      solveBtn.textContent = '⚡ 最適配送ルートを計算（解く）';
      resultImg.style.opacity = '1';

      statusBadge.textContent = '● 計算完了（制約検算済み）';
      statusBadge.classList.remove('stale');

      // Slight variance in metrics for realism
      metricTime.textContent = `-${(22.5 + Math.random() * 2.5).toFixed(1)}%`;
      metricLoad.textContent = `${(93.5 + Math.random() * 2.0).toFixed(1)}%`;
      metricViolation.textContent = '0件';
    }, 650);
  });
}
