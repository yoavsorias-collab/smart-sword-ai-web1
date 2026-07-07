// Configuration
const CONFIG = {
  SERVER_URL: 'http://192.168.1.100:5000',
  REFRESH_INTERVAL: 3000,
};

let aiActive = false;
let currentTab = 'home';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  loadServerUrl();
  startAutoRefresh();
});

function initializeApp() {
  console.log('🚀 Smart Sword AI Web Panel Initialized');
  updateStatus();
  setupEventListeners();
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = link.getAttribute('href').substring(1);
      switchTab(tabName);
    });
  });
}

// Tab Management
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active from nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected tab
  const tab = document.getElementById(tabName);
  if (tab) {
    tab.classList.add('active');
  }

  // Mark nav link as active
  const link = document.querySelector(`[href="#${tabName}"]`);
  if (link) {
    link.classList.add('active');
  }

  currentTab = tabName;

  // Load tab-specific data
  if (tabName === 'battles') {
    loadBattlesData();
  } else if (tabName === 'training') {
    loadTrainingData();
  } else if (tabName === 'ai') {
    loadAIData();
  }
}

// API Functions
async function fetchAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${CONFIG.SERVER_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    showToast('❌ שגיאה בחיבור ל-server', 'danger');
    return null;
  }
}

// Status Updates
async function updateStatus() {
  const status = await fetchAPI('/api/status');

  if (status) {
    document.getElementById('sword-status-text').textContent = 
      status.sword_connected ? '✅ מחוברת' : '❌ מנותקת';
    document.getElementById('camera-status-text').textContent = 
      status.camera_connected ? '✅ פעילה' : '❌ כבויה';
    document.getElementById('threats-count').textContent = status.threats_detected || 0;
    document.getElementById('connection-status').textContent = '🟢 מחובר';
  } else {
    document.getElementById('connection-status').textContent = '🔴 מנותק';
  }
}

// Sword Control
async function swordOpen() {
  showToast('🔓 פתח את החרב...', 'success');
  await fetchAPI('/api/sword/open', 'POST');
}

async function swordClose() {
  showToast('🔐 סגור את החרב...', 'success');
  await fetchAPI('/api/sword/close', 'POST');
}

async function swordStab(count) {
  showToast(`⚡ דקור ${count}x...`, 'success');
  await fetchAPI('/api/sword/stab', 'POST', { count });
}

async function defendMode() {
  showToast('🛡️ עמדת הגנה...', 'success');
  await swordOpen();
}

async function attackMode() {
  showToast('🔴 עמדת התקפה...', 'success');
  await swordStab(5);
}

// AI Functions
async function activateAI() {
  aiActive = true;
  showToast('🤖 AI מופעל...', 'success');
  loadAIData();
}

async function deactivateAI() {
  aiActive = false;
  showToast('⏹️ AI כבוי', 'danger');
}

async function loadAIData() {
  const analysis = await fetchAPI('/api/ai/analyze');

  if (analysis) {
    document.getElementById('combat-state').textContent = analysis.state || 'UNKNOWN';
    document.getElementById('threat-count').textContent = analysis.threats?.length || 0;
    document.getElementById('recommended-ability').textContent = 
      analysis.recommendation?.ability || 'אף אחת';
    document.getElementById('risk-level').textContent = 
      analysis.tactical_analysis?.risk_assessment || 0;

    // Update recommendation message
    const recBox = document.getElementById('ai-recommendation');
    if (recBox) {
      recBox.innerHTML = `
        <p class="recommendation-message">${analysis.recommendation?.message || 'ממתין למידע'}</p>
        <p class="recommendation-action">💭 פעולה: ${analysis.recommendation?.sword_action || '-'}</p>
      `;
    }
  }
}

// Battles
async function loadBattlesData() {
  const summary = await fetchAPI('/api/battles/summary');
  const battles = await fetchAPI('/api/battles/all');

  if (summary) {
    document.getElementById('total-battles').textContent = summary.total_battles || 0;
    document.getElementById('victories').textContent = summary.victories || 0;
    document.getElementById('defeats').textContent = summary.defeats || 0;
    document.getElementById('win-rate').textContent = 
      (summary.win_rate || 0).toFixed(1) + '%';
  }

  if (battles) {
    const battlesList = document.getElementById('battles-list');
    battlesList.innerHTML = '';

    battles.slice(0, 10).forEach(battle => {
      const item = document.createElement('div');
      item.className = `battle-item ${battle.result}`;
      item.innerHTML = `
        <div>
          <strong>${battle.name}</strong>
          <p>${new Date(battle.start_time).toLocaleString('he-IL')}</p>
        </div>
        <div>
          <p style="font-size: 0.875rem; color: var(--text-muted);">
            ⏱️ ${(battle.duration || 0).toFixed(1)}s
          </p>
          <p style="font-weight: bold; color: ${battle.result === 'victory' ? '#10b981' : '#ef4444'};">
            ${battle.result.toUpperCase()}
          </p>
        </div>
      `;
      battlesList.appendChild(item);
    });
  }
}

async function startBattle() {
  const result = await fetchAPI('/api/battle/start', 'POST', { name: 'קרב חדש' });

  if (result) {
    showToast('⚔️ קרב התחיל!', 'success');
    loadBattlesData();
  }
}

// Training
async function loadTrainingData() {
  const modes = await fetchAPI('/api/training/modes');

  if (modes) {
    loadTrainingProgress();
  }
}

async function selectTraining(mode) {
  const result = await fetchAPI('/api/training/start', 'POST', {
    mode,
    scenario_index: 0,
  });

  if (result && result.success) {
    showToast(`🎓 אימון התחיל: ${result.scenario.name}`, 'success');
  }
}

async function loadTrainingProgress() {
  const modes = ['beginner', 'intermediate', 'advanced', 'master'];
  const progressBars = document.getElementById('progress-bars');
  progressBars.innerHTML = '';

  for (const mode of modes) {
    const progress = await fetchAPI(`/api/training/progress/${mode}`);

    if (progress) {
      const percentage = progress.average_score || 0;
      const item = document.createElement('div');
      item.className = 'progress-item';
      item.innerHTML = `
        <label>${mode.toUpperCase()}</label>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%">
            ${percentage.toFixed(0)}%
          </div>
        </div>
        <p style="font-size: 0.875rem; color: var(--text-muted);">
          ✅ ${progress.completed_scenarios || 0} קרבות | 🏆 ניקוד: ${progress.best_score || 0}
        </p>
      `;
      progressBars.appendChild(item);
    }
  }
}

// Settings
function loadServerUrl() {
  const saved = localStorage.getItem('serverUrl');
  if (saved) {
    CONFIG.SERVER_URL = saved;
    document.getElementById('server-url').value = saved;
  }
}

function testConnection() {
  const url = document.getElementById('server-url').value;

  if (!url) {
    showToast('❌ הזן את כתובת ה-server', 'danger');
    return;
  }

  CONFIG.SERVER_URL = url;
  localStorage.setItem('serverUrl', url);

  updateStatus();
  showToast('✅ חיבור בדוק בהצלחה', 'success');
}

// Auto Refresh
function startAutoRefresh() {
  setInterval(() => {
    if (currentTab === 'home' || currentTab === 'control') {
      updateStatus();
    }

    if (currentTab === 'ai' && aiActive) {
      loadAIData();
    }
  }, CONFIG.REFRESH_INTERVAL);
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Switch Tab Function
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active from nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected tab
  const tab = document.getElementById(tabName);
  if (tab) {
    tab.classList.add('active');
  }

  // Mark nav link as active
  const link = document.querySelector(`[href="#${tabName}"]`);
  if (link) {
    link.classList.add('active');
  }

  currentTab = tabName;

  // Load tab-specific data
  if (tabName === 'battles') {
    loadBattlesData();
  } else if (tabName === 'training') {
    loadTrainingData();
  } else if (tabName === 'ai') {
    loadAIData();
  }
}
