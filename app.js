// Monty Hall Strategy Face-Off: Simulation Engine v5 (HUD Relocated)

let simState = {
  running: false,
  speed: 100,
  timer: null,
  stayData: { rounds: 0, wins: 0, rate: 0 },
  switchData: { rounds: 0, wins: 0, rate: 0 },
  historyCount: 0
};

// UI Elements
const speedSlider = document.getElementById('sim-speed-slider');
const speedIndicator = document.getElementById('speed-indicator');

speedSlider.oninput = function() {
  simState.speed = parseInt(this.value);
  speedIndicator.textContent = simState.speed <= 10 ? 'ターボモード (描写なし)' : `${simState.speed}ms`;
};

// Chart.js Configuration
const chart = new Chart(document.getElementById('convergenceChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: '「変える」勝率 (%)',
        data: [],
        borderColor: '#00ff87',
        backgroundColor: 'rgba(0, 255, 135, 0.05)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1
      },
      {
        label: '「変えない」勝率 (%)',
        data: [],
        borderColor: '#ff3e6c',
        backgroundColor: 'rgba(255, 62, 108, 0.05)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100, beginAtZero: true, ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.03)' }, title: { display: true, text: '勝率 (%)', color: '#94a3b8', font: { size: 10 } } },
      x: { display: true, ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 10 }, grid: { display: false }, title: { display: true, text: '試行回数', color: '#94a3b8', font: { size: 10 } } }
    },
    plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 10 } } } },
    animation: false
  }
});

function toggleSimulation() {
  simState.running = !simState.running;
  const btn = document.getElementById('btn-start-sim');
  btn.textContent = simState.running ? 'シミュレーション停止' : 'シミュレーション開始';
  btn.classList.toggle('btn-secondary', simState.running);
  
  if (simState.running) {
    runTrial();
  } else {
    clearTimeout(simState.timer);
    updateHud("STOPPED", false);
  }
}

function updateHud(text, isActive = true) {
    const huds = [document.getElementById('switch-phase-hud'), document.getElementById('stay-phase-hud')];
    huds.forEach(hud => {
        if (hud) {
            hud.textContent = text;
            if (isActive) hud.classList.add('active');
            else hud.classList.remove('active');
        }
    });
}

async function runTrial() {
  if (!simState.running) return;

  const targetRounds = parseInt(document.getElementById('target-rounds').value) || 10000;
  if (simState.historyCount >= targetRounds) {
    toggleSimulation();
    updateHud("MISSION COMPLETE", false);
    return;
  }

  if (simState.speed <= 10) {
    updateHud("TURBO MODE (FAST)", true);
    for (let i = 0; i < 50; i++) {
        if (simState.historyCount >= targetRounds) break;
        executeLogic();
        updateUI(); 
    }
    simState.timer = setTimeout(runTrial, 5);
    return;
  }

  // 1. PHASE: 選択
  updateHud("【1】初期選択", true);
  const logicResult = executeLogic();
  const { initialPick, revealedDoor, switchFinal, switchWin, stayWin } = logicResult;
  highlightDoors('stay', initialPick, 'picked');
  highlightDoors('switch', initialPick, 'picked');
  await wait(simState.speed);

  // 2. PHASE: 介入
  updateHud("【2】司会者の介入", true);
  highlightDoors('stay', revealedDoor, 'opened');
  highlightDoors('switch', revealedDoor, 'opened');
  await wait(simState.speed);

  // 3. PHASE: 最終決定
  updateHud("【3】最終決定", true);
  highlightDoors('stay', initialPick, 'final');
  highlightDoors('switch', switchFinal, 'final');
  await wait(simState.speed);

  // 4. Result
  showResult('stay', initialPick, stayWin);
  showResult('switch', switchFinal, switchWin);
  updateUI();
  await wait(simState.speed * 1.5);

  clearHighlights();
  if (simState.running) simState.timer = setTimeout(runTrial, 10);
}

function executeLogic() {
    const carDoor = Math.floor(Math.random() * 3) + 1;
    const initialPick = Math.floor(Math.random() * 3) + 1;
    let availableToGoat = [1, 2, 3].filter(d => d !== initialPick && d !== carDoor);
    let revealedDoor = availableToGoat[Math.floor(Math.random() * availableToGoat.length)];
    const switchFinal = [1, 2, 3].find(d => d !== initialPick && d !== revealedDoor);
    const switchWin = switchFinal === carDoor;
    const stayWin = initialPick === carDoor;

    simState.stayData.rounds++;
    if (stayWin) simState.stayData.wins++;
    simState.stayData.rate = (simState.stayData.wins / simState.stayData.rounds * 100);
    simState.switchData.rounds++;
    if (switchWin) simState.switchData.wins++;
    simState.switchData.rate = (simState.switchData.wins / simState.switchData.rounds * 100);

    return { initialPick, revealedDoor, switchFinal, switchWin, stayWin };
}

function updateUI() {
  document.getElementById('stay-rounds').textContent = simState.stayData.rounds;
  document.getElementById('stay-wins').textContent = simState.stayData.wins;
  document.getElementById('stay-rate').textContent = `${simState.stayData.rate.toFixed(1)}%`;
  document.getElementById('switch-rounds').textContent = simState.switchData.rounds;
  document.getElementById('switch-wins').textContent = simState.switchData.wins;
  document.getElementById('switch-rate').textContent = `${simState.switchData.rate.toFixed(1)}%`;

  simState.historyCount++;
  const sampleRate = simState.historyCount < 500 ? 1 : 10;
  if (simState.historyCount % sampleRate === 0) {
    chart.data.labels.push(simState.historyCount);
    chart.data.datasets[0].data.push(simState.switchData.rate.toFixed(1));
    chart.data.datasets[1].data.push(simState.stayData.rate.toFixed(1));
    if (chart.data.labels.length > 1000) { chart.data.labels.shift(); chart.data.datasets[0].data.shift(); chart.data.datasets[1].data.shift(); }
    chart.update('none');
  }
}

function highlightDoors(strategy, doorNum, className) {
  const el = document.getElementById(`${strategy}-door-${doorNum}`);
  if (el) el.classList.add(className);
}

function showResult(strategy, doorNum, isWin) {
  const mark = document.getElementById(`${strategy}-res-${doorNum}`);
  if (mark) { mark.textContent = isWin ? '⭕' : '❌'; mark.style.color = isWin ? 'var(--success-color)' : 'var(--error-color)'; mark.classList.add('show'); }
}

function clearHighlights() {
  document.querySelectorAll('.door-wrapper-small').forEach(el => el.classList.remove('picked', 'opened', 'final'));
  document.querySelectorAll('.result-mark').forEach(el => { el.classList.remove('show'); el.textContent = ''; });
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function toggleModal() {
    const overlay = document.getElementById('modal-overlay');
    const isShowing = overlay.classList.contains('show');
    if (isShowing) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 500);
        document.body.classList.remove('modal-open');
    } else {
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.classList.add('show');
            document.body.classList.add('modal-open');
        }, 10);
    }
}

function resetAll() {
  simState.running = false;
  simState.stayData = { rounds: 0, wins: 0, rate: 0 };
  simState.switchData = { rounds: 0, wins: 0, rate: 0 };
  simState.historyCount = 0;
  chart.data.labels = [0];
  chart.data.datasets[0].data = [0];
  chart.data.datasets[1].data = [0];
  chart.update();
  updateUI();
  updateHud("READY", false);
  document.getElementById('btn-start-sim').textContent = 'シミュレーション開始';
  document.getElementById('btn-start-sim').classList.remove('btn-secondary');
  clearHighlights();
  clearTimeout(simState.timer);
}

window.onload = () => { chart.data.labels = [0]; chart.data.datasets[0].data = [0]; chart.data.datasets[1].data = [0]; chart.update(); };
