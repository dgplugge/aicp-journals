const PROJECTS = [
  { key: 'InterAI-Protocol', label: 'InterAI Protocol' },
  { key: 'OperatorHub',      label: 'OperatorHub' },
  { key: 'StudyGuide',       label: 'Study Guide' },
  { key: 'PortfolioAnalysis',label: 'Portfolio Analysis' }
];

let allMessages = {};
let currentProject = null;
let messageContents = {};

async function init() {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = '<div class="loading"><div class="spinner"></div><br>Loading journals...</div>';

  for (const proj of PROJECTS) {
    try {
      const res = await fetch(`data/${proj.key}/journal-index.json`);
      if (res.ok) {
        const data = await res.json();
        allMessages[proj.key] = (data.messages || []).map(m => ({ ...m, _project: proj.key }));
      }
    } catch (e) {
      console.warn(`Could not load ${proj.key}:`, e);
    }
  }

  buildNav();

  const firstAvailable = PROJECTS.find(p => allMessages[p.key]?.length > 0);
  if (firstAvailable) selectProject(firstAvailable.key);
  else messagesDiv.innerHTML = '<div class="loading">No journals found.</div>';

  document.getElementById('search').addEventListener('input', renderMessages);
  document.getElementById('filter-type').addEventListener('change', renderMessages);
  document.getElementById('filter-from').addEventListener('change', renderMessages);
}

function buildNav() {
  const nav = document.querySelector('.nav-inner');
  nav.innerHTML = '';
  for (const proj of PROJECTS) {
    const msgs = allMessages[proj.key] || [];
    if (msgs.length === 0) continue;
    const btn = document.createElement('button');
    btn.className = 'nav-btn';
    btn.dataset.project = proj.key;
    btn.innerHTML = `${proj.label}<span class="msg-count">(${msgs.length})</span>`;
    btn.addEventListener('click', () => selectProject(proj.key));
    nav.appendChild(btn);
  }
}

function selectProject(key) {
  currentProject = key;
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.project === key);
  });
  messageContents = {};
  populateFromFilter();
  renderMessages();
}

function populateFromFilter() {
  const select = document.getElementById('filter-from');
  const current = select.value;
  select.innerHTML = '<option value="">All</option>';
  const msgs = allMessages[currentProject] || [];
  const senders = [...new Set(msgs.map(m => m.from))].sort();
  for (const s of senders) {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  }
  select.value = current;
}

function getFilteredMessages() {
  const msgs = allMessages[currentProject] || [];
  const search = document.getElementById('search').value.toLowerCase().trim();
  const typeFilter = document.getElementById('filter-type').value;
  const fromFilter = document.getElementById('filter-from').value;

  return msgs.filter(m => {
    if (typeFilter && (m.type || '').toUpperCase() !== typeFilter) return false;
    if (fromFilter && m.from !== fromFilter) return false;
    if (search) {
      const haystack = [m.id, m.type, m.from, m.task, m.file, m.time, m.subject]
        .filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(search)) {
        const content = messageContents[m.file];
        if (content && content.toLowerCase().includes(search)) return true;
        return false;
      }
    }
    return true;
  });
}

function renderMessages() {
  const filtered = getFilteredMessages();
  const countDiv = document.getElementById('message-count');
  const total = (allMessages[currentProject] || []).length;
  countDiv.textContent = filtered.length === total
    ? `${total} messages`
    : `${filtered.length} of ${total} messages`;

  const container = document.getElementById('messages');
  container.innerHTML = '';

  for (const msg of filtered) {
    const card = document.createElement('div');
    card.className = 'msg-card';
    card.dataset.file = msg.file || '';

    const type = (msg.type || 'MSG').toUpperCase();
    const from = msg.from || 'Unknown';
    const task = msg.task || msg.subject || '';
    const time = msg.time || msg.date || '';
    const dateStr = time ? formatDate(time) : '';

    card.innerHTML = `
      <div class="msg-header">
        <span class="msg-chevron">&#9654;</span>
        <span class="msg-id">${escapeHtml(msg.id || '')}</span>
        <span class="msg-type ${type}">${type}</span>
        <span class="msg-from ${from}">${escapeHtml(from)}</span>
        <span class="msg-task">${escapeHtml(task)}</span>
        <span class="msg-date">${dateStr}</span>
      </div>
      <div class="msg-body">
        <div class="msg-meta">
          ${msg.to ? `<span>To: ${escapeHtml(Array.isArray(msg.to) ? msg.to.join(', ') : msg.to)}</span>` : ''}
          ${msg.ref ? `<span>Ref: ${escapeHtml(msg.ref)}</span>` : ''}
          ${time ? `<span>${escapeHtml(time)}</span>` : ''}
        </div>
        <div class="msg-content">Loading...</div>
      </div>
    `;

    const header = card.querySelector('.msg-header');
    header.addEventListener('click', () => toggleCard(card, msg));

    container.appendChild(card);
  }
}

async function toggleCard(card, msg) {
  const wasExpanded = card.classList.contains('expanded');
  card.classList.toggle('expanded');

  if (!wasExpanded && msg.file) {
    const contentDiv = card.querySelector('.msg-content');
    if (messageContents[msg.file]) {
      contentDiv.textContent = messageContents[msg.file];
    } else {
      try {
        const res = await fetch(`data/${currentProject}/${msg.file}`);
        if (res.ok) {
          const text = await res.text();
          messageContents[msg.file] = text;
          contentDiv.textContent = text;
        } else {
          contentDiv.textContent = `[Could not load: ${msg.file}]`;
        }
      } catch (e) {
        contentDiv.textContent = `[Error loading message]`;
      }
    }

    const search = document.getElementById('search').value.trim();
    if (search) highlightContent(contentDiv, search);
  }
}

function highlightContent(el, term) {
  const text = el.textContent;
  const lower = text.toLowerCase();
  const tLower = term.toLowerCase();
  let idx = lower.indexOf(tLower);
  if (idx === -1) return;

  const frag = document.createDocumentFragment();
  let last = 0;
  while (idx !== -1) {
    frag.appendChild(document.createTextNode(text.slice(last, idx)));
    const span = document.createElement('span');
    span.className = 'highlight';
    span.textContent = text.slice(idx, idx + term.length);
    frag.appendChild(span);
    last = idx + term.length;
    idx = lower.indexOf(tLower, last);
  }
  frag.appendChild(document.createTextNode(text.slice(last)));
  el.textContent = '';
  el.appendChild(frag);
}

function formatDate(timeStr) {
  try {
    const d = new Date(timeStr);
    if (isNaN(d)) return timeStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return timeStr;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
