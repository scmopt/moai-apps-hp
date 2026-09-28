/* ========================================
   MOAI Agent Skills — Page Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTabs('chain');
  initSimulator();
  initConsoleDemo();
  initSkillsCatalog();
  initSkillModal();
});

// ---- Chain story tabs ----
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

// ---- ROI simulator ----
function initSimulator() {
  const salesSlider = document.getElementById('sim-sales');
  const invSlider = document.getElementById('sim-inv');
  const forecastSlider = document.getElementById('sim-forecast');
  const dcSlider = document.getElementById('sim-dc');

  const salesVal = document.getElementById('val-sales');
  const invVal = document.getElementById('val-inv');
  const forecastVal = document.getElementById('val-forecast');
  const dcVal = document.getElementById('val-dc');

  const resReduction = document.getElementById('res-reduction');
  const resHolding = document.getElementById('res-holding');
  const resService = document.getElementById('res-service');
  const resCostRatio = document.getElementById('res-cost-ratio');
  const recSkills = document.getElementById('rec-skills');

  function updateSimulation() {
    const sales = parseFloat(salesSlider.value);
    const inventory = parseFloat(invSlider.value);
    const forecastImp = parseFloat(forecastSlider.value);
    const dcCount = parseInt(dcSlider.value);

    // Update labels
    salesVal.textContent = sales.toLocaleString() + ' 億円';
    invVal.textContent = inventory.toLocaleString() + ' 億円';
    forecastVal.textContent = forecastImp + ' %';
    dcVal.textContent = dcCount + ' 拠点';

    // Calculation logic based on CLO empirical findings:
    // Safety stock is ~46% of inventory for unpredicted demand.
    // Reducing forecast error sigma by X% directly translates to dynamic inventory reduction.
    const reductionRatio = (forecastImp / 100) * 0.9; // e.g. 50% imp -> ~45% reduction
    const invReductionAmount = inventory * reductionRatio;
    const holdingCostSaved = invReductionAmount * 0.15; // 15% holding cost (warehousing, capital cost)

    // Service level & DC tradeoff (Sqrt law: more DCs = shorter transport distance, but DC fixed cost increases)
    // At ~9 DCs, 300km limit satisfied with 45% DC fixed cost share.
    let coverage = Math.min(99.5, 65 + dcCount * 3.8);
    let dcCostShare = Math.min(65, 20 + dcCount * 2.8);

    // Format & Render
    resReduction.innerHTML = invReductionAmount.toFixed(1) + '<span>億円</span>';
    resHolding.innerHTML = holdingCostSaved.toFixed(2) + '<span>億円/年</span>';
    resService.innerHTML = coverage.toFixed(1) + '<span>%</span>';
    resCostRatio.innerHTML = dcCostShare.toFixed(0) + '<span>%</span>';

    // Contextual Recommendations
    let recText = '';
    if (forecastImp >= 35 && dcCount >= 7) {
      recText = `<strong>最適推奨連鎖:</strong> <span class="chip">dynamic-inventory</span> による在庫 <strong>${(reductionRatio*100).toFixed(0)}%</strong> 削減を前提に、<span class="chip">logistics-network</span> でDC固定費（${dcCostShare.toFixed(0)}%）を抑制した最適 ${dcCount} 拠点配車へ直結可能です。`;
    } else if (forecastImp < 35) {
      recText = `<strong>まず取り組むべき連鎖:</strong> <span class="chip">timeseries-forecasting</span> で需要誤差σを半減させ、<span class="chip">dynamic-inventory</span> で安全在庫の46%余剰を削減する第一段階をお勧めします。`;
    } else {
      recText = `<strong>最適推奨連鎖:</strong> 拠点数が少ないため、<span class="chip">service-network</span> による幹線積替えハブ構想と、<span class="chip">solving-vrp</span> によるラストワンマイル配車の組み合わせが最大効果を生みます。`;
    }
    recSkills.innerHTML = recText;
  }

  salesSlider.addEventListener('input', updateSimulation);
  invSlider.addEventListener('input', updateSimulation);
  forecastSlider.addEventListener('input', updateSimulation);
  dcSlider.addEventListener('input', updateSimulation);

  updateSimulation();
}

// ---- Prompt console demo ----
const consolePresets = {
  vrp: {
    title: 'ラストワンマイル配車計画',
    skill: 'solving-vrp / vrp-visualization',
    prompt: `「本日配送予定の120件の顧客注文データ（orders.csv）と、2t車両4台・4t車両2台の稼働可能条件を渡します。各顧客の荷受時間帯（時間枠）と積載制限を厳密に守り、総走行時間を最小化する配送ルートを組んでください。結果は地図付きHTMLで出力してください。」`,
    outputImg: 'assets/vrp_02.png',
    metrics: [
      { label: '総走行時間', val: '-23.4%' },
      { label: '車両積載率', val: '94.2%' },
      { label: '時間枠違反', val: '0件' }
    ]
  },
  inventory: {
    title: '需要予測連動・動的在庫最適化',
    skill: 'dynamic-inventory / timeseries-forecasting',
    prompt: `「日次需要実績（daily_sales.csv）をもとに、LightGBMと指数平滑化で翌月需要を予測し、予測誤差をもとに動的在庫方策（ダイナミック発注点）をシミュレーションしてください。従来の定常安全在庫と比較して、在庫金額と欠品率がどう変化するかレポートを作成してください。」`,
    outputImg: 'assets/dyn_07.png',
    metrics: [
      { label: '在庫削減率', val: '-45.1%' },
      { label: '予測誤差σ', val: '半減(0.53)' },
      { label: '欠品率', val: '0.2%以下' }
    ]
  },
  scheduler: {
    title: '生産・設備スケジューリング',
    skill: 'optseq-scheduler',
    prompt: `「今週生産すべき24ジョブの作業手順と段取り時間表を渡します。プレス機3台と溶接ロボット2台の競合を解消し、全体のメイクスパン（完了時刻）を最小化する詳細ガントチャートを作成してください。納期遅れは許容しません。」`,
    outputImg: 'assets/sched_01.png',
    metrics: [
      { label: '総完了時間', val: '38.5時間' },
      { label: '納期遵守率', val: '100%' },
      { label: '設備稼働率', val: '91.8%' }
    ]
  },
  network: {
    title: '物流ネットワーク・拠点配置',
    skill: 'logistics-network / spatial-analysis',
    prompt: `「全国の配送先分布と需要量から、配送リードタイム300km以内を全数カバーする物流センター（DC）の最適配置と担当エリアを決定してください。DC固定費と幹線輸送費・地域配送費の総コストが最小となる拠点数を算出してください。」`,
    outputImg: 'assets/net_02.png',
    metrics: [
      { label: '最適拠点数', val: '9拠点' },
      { label: 'DC固定費比率', val: '45%' },
      { label: '300kmカバー率', val: '98.5%' }
    ]
  }
};

function initConsoleDemo() {
  const tabBtns = document.querySelectorAll('.mock-tab[data-preset]');
  const promptTextEl = document.getElementById('console-prompt-content');
  const runBtn = document.getElementById('console-run-btn');
  const outputImgEl = document.getElementById('console-output-image');
  const metricsContainer = document.getElementById('console-metrics-container');

  function renderPreset(key) {
    const data = consolePresets[key];
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-preset') === key);
    });

    promptTextEl.innerHTML = `<span class="agent-tag">@AgentSkill (${data.skill})</span><br><br>${data.prompt}`;
    outputImgEl.src = data.outputImg;

    metricsContainer.innerHTML = data.metrics.map(m => `
      <div class="metric-pill">
        <div class="metric-pill-label">${m.label}</div>
        <div class="metric-pill-val">${m.val}</div>
      </div>
    `).join('');
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => renderPreset(btn.getAttribute('data-preset')));
  });

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.textContent = '最適化ソルバー計算中...';
    outputImgEl.style.opacity = '0.3';

    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.textContent = '✨ スキルを再実行';
      outputImgEl.style.opacity = '1';
    }, 600);
  });

  renderPreset('vrp');
}

// ---- 15 skills catalog ----
const skillsData = [
  {
    id: 'timeseries-visualization',
    category: 'inventory',
    catName: '需要・在庫',
    name: 'timeseries-visualization',
    headline: '需要の可視化とパターン分類',
    summary: '出荷・売上データを平坦・季節性・散発に自動判定し、スパークラインと詳細チャートで把握。',
    inputs: '日次・月次出荷CSV（日付、品目、数量）',
    outputs: '需要変動係数(CV)、欠測・間欠判定レポートHTML',
    bookRef: '第2章「需要を見る」'
  },
  {
    id: 'inventory-classification',
    category: 'inventory',
    catName: '需要・在庫',
    name: 'inventory-classification',
    headline: 'ABC-XYZ・多面在庫分類',
    summary: '金額集中度(ABC)と変動性(XYZ)を掛け合わせた9象限分析。AXの売上63%とAZ要注意SKUを特定。',
    inputs: '品目別年間売上・需要ばらつきデータ',
    outputs: 'ABC-XYZマトリクス、パレート分析HTML',
    bookRef: '第3章「重要度と読みやすさで分ける」'
  },
  {
    id: 'inventory-optimization',
    category: 'inventory',
    catName: '需要・在庫',
    name: 'inventory-optimization',
    headline: '数理在庫方策・安全在庫の決定',
    summary: 'EOQ・発注点・(s, S)方策を算出。「安全在庫の46%は読めないことへの支払い」であることを解明。',
    inputs: '需要平均・標準偏差、調達リードタイム、サービス率',
    outputs: '最適発注量、安全在庫配置表、コスト比較HTML',
    bookRef: '第4章「在庫方策を決める」'
  },
  {
    id: 'timeseries-forecasting',
    category: 'inventory',
    catName: '需要・在庫',
    name: 'timeseries-forecasting',
    headline: '需要予測＆誤差σの定量測定',
    summary: '機械学習と時系列モデルを比較。予測誤差の標準偏差σが実需σの約半分になることを実証。',
    inputs: '日次実績系列、カレンダー特徴量',
    outputs: '将来予測値、予測誤差分布、バックテストHTML',
    bookRef: '第5章「需要を予測し、誤差を測る」'
  },
  {
    id: 'dynamic-inventory',
    category: 'inventory',
    catName: '需要・在庫',
    name: 'dynamic-inventory',
    headline: '予測連動の動的在庫方策（在庫45%減）',
    summary: '予測結果を日次発注点に直結するシミュレーション。静的方策比で在庫45%削減と欠品減を同時達成。',
    inputs: '予測値と実績値の時系列ペア、リードタイム',
    outputs: '動的vs静的在庫推移ダッシュボードHTML',
    bookRef: '第6章「予測を発注につなぐ」'
  },
  {
    id: 'logistics-network',
    category: 'logistics',
    catName: '物流・ネットワーク',
    name: 'logistics-network',
    headline: '物流センター(DC)最適拠点配置',
    summary: '配送距離制約（300km）から最適9拠点を導出。総費用の最大項目がDC固定費(45%)になる構造を解明。',
    inputs: '顧客座標・需要量、拠点候補地・固定費・輸送運賃',
    outputs: '重心法・k-median・エルボー法地図HTML',
    bookRef: '第7章「拠点をどこに置くか」'
  },
  {
    id: 'solving-vrp',
    category: 'logistics',
    catName: '物流・ネットワーク',
    name: 'solving-vrp / vrp-vis',
    headline: 'ラストワンマイル配車計画・ルート最適化',
    summary: '複数時間枠・積載重量・実道路時間行列・車両スキルを考慮し、ミリ秒〜数秒で費用最小ルートを生成。',
    inputs: '配送先座標、時間枠、積載量、車両スペック',
    outputs: '車両別走行ルート地図、配車計画表HTML',
    bookRef: '第8章「その日の配車を決める」'
  },
  {
    id: 'disruption-risk',
    category: 'production',
    catName: '製造・生産',
    name: 'disruption-risk',
    headline: '多段BOM調達途絶リスク・CVaR分析',
    summary: 'サプライチェーンの多段部品表を遡り、TTS/TTRから露出期間を算出して安全在庫を戦略配置。',
    inputs: 'BOM階層構造、調達先リードタイム、復旧日数(TTR)',
    outputs: 'リスク階層ネットワークグラフ、露出度HTML',
    bookRef: '第9章「どの調達先が止まると困るか」'
  },
  {
    id: 'production-lotsizing',
    category: 'production',
    catName: '製造・生産',
    name: 'production-lotsizing',
    headline: '多品目生産ロットサイズ最適化',
    summary: '段取り時間と在庫保管費用のトレードオフをWagner-Whitin法等で解き、ライン能力内で最適計画。',
    inputs: '品目別需要、ライン能力上限、段取り費用、BOM',
    outputs: '日次生産計画表、段取りカレンダーHTML',
    bookRef: '第10章「いつ、どのラインで、どれだけ作るか」'
  },
  {
    id: 'optseq-scheduler',
    category: 'production',
    catName: '製造・生産',
    name: 'optseq-scheduler',
    headline: '資源制約付き詳細ジョブスケジューリング',
    summary: '設備・作業員・治具の競合を解消し、メイクスパン最小または納期遅れ最小の計画をガント化。',
    inputs: '作業手順、所要時間、先行制約、資源上限、納期',
    outputs: '設備別インタラクティブガントチャートHTML',
    bookRef: '第11章「その日の中で、どの順に流すか」'
  },
  {
    id: 'shift-scheduling',
    category: 'resource',
    catName: '組織・リソース',
    name: 'shift-scheduling',
    headline: '制約充足によるスタッフ勤務表最適化',
    summary: '夜勤明けインターバル、連続勤務上限、スキル充足、希望休を厳密に満たす公平なシフトを自動生成。',
    inputs: 'スタッフ一覧、スキル、希望休、日別必要人数',
    outputs: '月間シフト表、制約充足度チェックHTML',
    bookRef: '第12章「誰がいつ働くか」'
  },
  {
    id: 'service-network',
    category: 'logistics',
    catName: '物流・ネットワーク',
    name: 'service-network',
    headline: '幹線輸送サービスネットワーク設計',
    summary: 'ハブ＆スポークの積替え便数と運行ダイヤを最適化。小口荷物を集約して車両台数を最小化。',
    inputs: 'OD輸送需要、積替えハブ候補、車両積載量・便費用',
    outputs: '幹線運行ダイヤグラム、ハブ集約フローHTML',
    bookRef: '第13章「幹線輸送をどうつなぐか」'
  },
  {
    id: 'revenue-management',
    category: 'resource',
    catName: '組織・リソース',
    name: 'revenue-management',
    headline: '輸送容量・枠のレベニューマネジメント',
    summary: '限られた荷台・座席枠を価格の異なる顧客区分に配分。シャドウプライスから入札価格（限界価値）を算出。',
    inputs: 'キャパシティ枠、区分別需要予測・単価設定',
    outputs: '予約上限表、入札価格カーブ、収益比較HTML',
    bookRef: '第14章「空いた荷台を誰に売るか」'
  },
  {
    id: 'scml-optimization',
    category: 'scml',
    catName: '全体最適化モデル',
    name: 'scml-optimization',
    headline: '供給網全体の数理モデリング（SCML）',
    summary: '調達・多段生産・物流拠点・輸送・在庫・資源上限を包含し、全社総費用最小の計画を一括立案。',
    inputs: 'サプライチェーン定義言語(SCML)モデルまたはCSV一式',
    outputs: '全社物流・生産・調達統合計画HTML',
    bookRef: '第15章「既製のスキルに収まらない問いはモデルを書く」'
  },
  {
    id: 'scop-optimizer',
    category: 'scml',
    catName: '全体最適化モデル',
    name: 'scop-optimizer',
    headline: '複雑な離散制約充足・割当最適化',
    summary: 'トラックバースの着発時刻割当など、「変数から1つの値を選ぶ」多制約組合せ問題を高速解決。',
    inputs: '対象変数、ドメイン候補値、重み付き制約定義',
    outputs: '最適割当マトリクス、ペナルティ検算HTML',
    bookRef: '第16章「バースと時刻を割り当てる」'
  }
];

function initSkillsCatalog() {
  const gridEl = document.getElementById('skills-catalog-grid');
  const filterBtns = document.querySelectorAll('#skills-filter .mock-tab');

  function renderGrid(filter) {
    const filtered = filter === 'all' ? skillsData : skillsData.filter(s => s.category === filter);

    gridEl.innerHTML = filtered.map(skill => `
      <button type="button" class="skill-card" data-id="${skill.id}">
        <div>
          <span class="chip">${skill.catName}</span>
          <div class="skill-name">${skill.name}</div>
          <div class="skill-headline">${skill.headline}</div>
          <p class="skill-summary">${skill.summary}</p>
        </div>
        <div class="skill-card-foot">
          <span>📖 ${skill.bookRef}</span>
          <span class="more">詳細 →</span>
        </div>
      </button>
    `).join('');

    gridEl.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('click', () => {
        const skill = skillsData.find(s => s.id === card.getAttribute('data-id'));
        if (skill) showSkillModal(skill);
      });
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      renderGrid(btn.getAttribute('data-filter'));
    });
  });

  renderGrid('all');
}

// ---- Skill detail modal ----
function closeSkillModal() {
  document.getElementById('skillModal').classList.remove('active');
  document.body.style.overflow = '';
}

function initSkillModal() {
  const modal = document.getElementById('skillModal');
  modal.querySelector('.modal-close').addEventListener('click', closeSkillModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSkillModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeSkillModal();
  });
}

function showSkillModal(skill) {
  document.getElementById('modal-skill-cat').textContent = skill.catName;
  document.getElementById('modal-skill-name').textContent = skill.name;
  document.getElementById('modal-skill-headline').textContent = skill.headline;
  document.getElementById('modal-skill-desc').textContent = skill.summary;
  document.getElementById('modal-skill-inputs').textContent = skill.inputs;
  document.getElementById('modal-skill-outputs').textContent = skill.outputs;
  document.getElementById('modal-skill-book').textContent = skill.bookRef;

  document.getElementById('skillModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
