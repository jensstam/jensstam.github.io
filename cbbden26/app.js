// ── Storage ───────────────────────────────────────────────────────────
const STORAGE_KEY = 'cbb_denver_2025';

const defaultData = [
  {
    id: 'd0', name: 'Saturday, April 18', emoji: '✈️',
    events: [
      { id:'e0', time:'12:00 PM', activity:'Connor Arrival', location:'DIA', link:'', notes:'', icon:'✈️', tags:[] },
      { id:'e1', time:'12:30 PM', activity:'Jens & Connor Lunch', location:'La Calle Grill (food truck) + Beer Garden', link:'', notes:'', icon:'🌮', tags:[] },
      { id:'e2', time:'2:00 PM', activity:'Ben & Ashley Arrival', location:'DIA', link:'', notes:'', icon:'✈️', tags:[] },
      { id:'e3', time:'5:00 PM', activity:'Early Dinner', location:'Just BE Kitchen (LoHi)', link:'https://www.justbekitchen.com/lohi', notes:'DF/NF/Soy-free', icon:'🥗', tags:['df','nf','sf'] },
      { id:'e4', time:'7:00 PM', activity:'Ghost Tour & Pub Crawl', location:'Denver Terrors - Haunted Pub Crawl', link:'https://denverterrors.com/haunted-pub-crawl/', notes:'', icon:'👻', tags:[] },
    ]
  },
  {
    id: 'd1', name: 'Sunday, April 19', emoji: '🎨',
    events: [
      { id:'e5', time:'9:00 AM', activity:'Breakfast', location:'At Home', link:'', notes:'', icon:'🥞', tags:['home'] },
      { id:'e6', time:'11:00 AM', activity:'Immersive Art Experience', location:'Meow Wolf Denver', link:'https://meowwolf.com', notes:'2-3 hour duration; pre-buy tickets', icon:'🌌', tags:['tip'] },
      { id:'e7', time:'2:00 PM', activity:'"Cool" Lunch', location:'Vital Root (Tennyson St)', link:'https://ediblebeats.com/restaurants/vital-root/', notes:'GF; Plant-based focus', icon:'🌿', tags:['gf'] },
      { id:'e8', time:'6:00 PM', activity:'Dinner at Home', location:'Home', link:'', notes:'Grilling', icon:'🍖', tags:['home'] },
    ]
  },
  {
    id: 'd2', name: 'Monday, April 20', emoji: '🌸',
    events: [
      { id:'e9',  time:'8:00 AM', activity:'Breakfast', location:'At Home', link:'', notes:'', icon:'☕', tags:['home'] },
      { id:'e10', time:'10:00 AM', activity:'Botanical Gardens', location:'Denver Botanic Gardens', link:'https://www.botanicgardens.org', notes:'', icon:'🌺', tags:[] },
      { id:'e11', time:'1:00 PM', activity:'Afternoon Exploration', location:'Cherry Creek North OR Downtown Golden', link:'', notes:'Shopping/galleries', icon:'🛍️', tags:[] },
      { id:'e12', time:'1:30 PM', activity:'Lunch/Snack', location:'Ad hoc at CCN/DG', link:'', notes:'Get a snack while perusing the shops', icon:'🧇', tags:[] },
      { id:'e13', time:'5:30 PM', activity:'Dinner', location:'Courtyard Social', link:'https://courtyardsocialcr.com/castle-rock-courtyard-social-food-menu', notes:'GF & DF options', icon:'🍽️', tags:['gf','df'] },
      { id:'e14', time:'7:30 PM', activity:'Barcade', location:'The 1Up Arcade Bar (Greenwood Village)', link:'https://the1uparcadebar.com/pages/greenwood-village', notes:'', icon:'🕹️', tags:[] },
    ]
  },
  {
    id: 'd3', name: 'Tuesday, April 21', emoji: '🔴',
    events: [
      { id:'e15', time:'9:00 AM', activity:'Breakfast', location:'No Cow Bakery (Castle Rock)', link:'https://www.nocowbakery.com', notes:'GF & DF', icon:'🧁', tags:['gf','df'] },
      { id:'e16', time:'11:00 AM', activity:'Chill Vibes', location:'Castle Rock', link:'https://www.crgov.com/2842/Rock-Park', notes:'Rock park hike / walk around downtown Castle Rock', icon:'🪨', tags:[] },
      { id:'e17', time:'3:00 PM', activity:'Late Lunch / Early Dinner', location:'Mad Greens (Castle Rock)', link:'https://www.madgreens.com', notes:'GF & DF & NF options', icon:'🥙', tags:['gf','df','nf'] },
      { id:'e18', time:'4:30 PM', activity:'Drive to Red Rocks', location:'Morrison, CO', link:'https://www.redrocksonline.com/plan-your-visit/permitted-prohibited-items/', notes:'Rush hour weekday, leave early', icon:'🚗', tags:['tip'] },
      { id:'e19', time:'7:00 PM', activity:'Concert', location:'Red Rocks Amphitheatre', link:'https://www.redrocksonline.com/events/ethel-cain-1145150/', notes:'', icon:'🎸', tags:['concert'] },
    ]
  },
  {
    id: 'd4', name: 'Wednesday, April 22', emoji: '👋',
    events: [
      { id:'e20', time:'9:00 AM', activity:'Leave for Airport', location:'', link:'', notes:'', icon:'🛣️', tags:[] },
      { id:'e21', time:'12:00 PM', activity:'Connor Departure', location:'DIA', link:'', notes:'Leave by 9am', icon:'✈️', tags:[] },
      { id:'e22', time:'2:00 PM', activity:'Ashley/Ben Departure', location:'DIA', link:'', notes:'', icon:'✈️', tags:[] },
    ]
  }
];

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultData));
  } catch(e) { return JSON.parse(JSON.stringify(defaultData)); }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

// ── State ─────────────────────────────────────────────────────────────
let data = loadData();
let editMode = false;
let editingEventId = null;
let editingDayId = null;
let editingDayForNewEvent = null;

// ── Tag definitions ───────────────────────────────────────────────────
const TAG_DEFS = [
  { key:'gf',      label:'Gluten-Free',   cls:'tag-gf' },
  { key:'df',      label:'Dairy-Free',    cls:'tag-df' },
  { key:'nf',      label:'Nut-Free',      cls:'tag-nf' },
  { key:'sf',      label:'Soy-Free',      cls:'tag-sf' },
  { key:'tip',     label:'⚠️ Book Ahead', cls:'tag-tip' },
  { key:'home',    label:'At Home',       cls:'tag-home' },
  { key:'concert', label:'Concert 🎸',    cls:'tag-concert' },
  { key:'special', label:'Special ✨',    cls:'tag-special' },
];

function tagHtml(keys) {
  if (!keys || !keys.length) return '';
  return '<div class="tags">' + keys.map(k => {
    const def = TAG_DEFS.find(t => t.key === k);
    return def ? `<span class="tag ${def.cls}">${def.label}</span>` : '';
  }).join('') + '</div>';
}

// ── Render ────────────────────────────────────────────────────────────
function renderAll() {
  const container = document.getElementById('itinerary');
  container.innerHTML = data.map((day, di) => renderDay(day, di)).join('');
}

function renderDay(day, di) {
  const colorClass = `day-${Math.min(di, 4)}`;
  const eventsHtml = day.events.map(ev => renderEvent(ev)).join('');
  const count = day.events.length;
  return `
    <div class="day-section ${colorClass}" id="day-${day.id}">
      <div class="day-header" onclick="toggleDay('${day.id}', event)">
        <div class="day-left">
          <span class="day-emoji">${day.emoji || '📅'}</span>
          <div>
            <div class="day-name">${day.name}</div>
            <div class="day-date-sub">${count} event${count !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <div class="day-right">
          <span class="event-count">${count}</span>
          <button class="edit-day-btn" onclick="openDayModal('${day.id}', event)">✏️ Edit</button>
          <span class="chevron">▼</span>
        </div>
      </div>
      <div class="events-body">
        ${eventsHtml}
        <button class="add-event-btn" onclick="openEventModal(null, '${day.id}')">＋ Add Event</button>
      </div>
    </div>`;
}

function renderEvent(ev) {
  const linkHtml = ev.link
    ? `<a class="event-link" href="${ev.link}" target="_blank" rel="noopener">🔗 ${ev.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>`
    : '';
  const notesHtml = ev.notes ? `<div class="event-notes">📝 ${ev.notes}</div>` : '';
  const tagsHtml = tagHtml(ev.tags);
  return `
    <div class="event-card" id="ev-${ev.id}">
      <div class="event-time">${ev.time || ''}</div>
      <div class="event-icon">${ev.icon || '📌'}</div>
      <div class="event-content">
        <div class="event-title">${ev.activity}</div>
        ${ev.location ? `<div class="event-location">📍 ${ev.location}</div>` : ''}
        ${notesHtml}
        ${linkHtml}
        ${tagsHtml}
      </div>
      <div class="event-edit-btns">
        <button class="ev-btn edit" onclick="openEventModal('${ev.id}', null)">✏️</button>
        <button class="ev-btn del" onclick="deleteEvent('${ev.id}')">🗑️</button>
      </div>
    </div>`;
}

// ── Collapse ──────────────────────────────────────────────────────────
function toggleDay(dayId, e) {
  if (e.target.closest('.edit-day-btn')) return;
  document.getElementById('day-' + dayId).classList.toggle('collapsed');
}

// ── Password gate ─────────────────────────────────────────────────────
const EDIT_PW = 'CBBDen';

function openPwModal() {
  document.getElementById('pwInput').value = '';
  document.getElementById('pwError').textContent = '';
  document.getElementById('pwModal').classList.add('open');
  setTimeout(() => document.getElementById('pwInput').focus(), 100);
}

function closePwModal() {
  document.getElementById('pwModal').classList.remove('open');
}

function checkPassword() {
  if (document.getElementById('pwInput').value === EDIT_PW) {
    closePwModal();
    enableEditMode();
  } else {
    document.getElementById('pwError').textContent = '❌ Incorrect password!';
    document.getElementById('pwInput').value = '';
    document.getElementById('pwInput').focus();
  }
}

function enableEditMode() {
  editMode = true;
  document.body.classList.add('edit-mode');
  document.getElementById('editToggle').classList.add('on');
  document.getElementById('toggleLabel').textContent = 'ON';
}

// ── Edit mode toggle ──────────────────────────────────────────────────
document.getElementById('editToggle').addEventListener('click', function () {
  if (editMode) {
    editMode = false;
    document.body.classList.remove('edit-mode');
    this.classList.remove('on');
    document.getElementById('toggleLabel').textContent = 'OFF';
  } else {
    openPwModal();
  }
});

// ── Add Day ───────────────────────────────────────────────────────────
function addDay() {
  data.push({ id: 'd' + Date.now(), name: 'New Day', emoji: '📅', events: [] });
  saveData(data);
  renderAll();
}

// ── Event Modal ───────────────────────────────────────────────────────
function openEventModal(eventId, dayId) {
  editingEventId = eventId;
  editingDayForNewEvent = dayId;

  document.getElementById('modalTitle').textContent = eventId ? '✏️ Edit Event' : '✨ Add Event';

  const box = document.getElementById('tagCheckboxes');
  box.innerHTML = TAG_DEFS.map(t =>
    `<label style="display:flex;align-items:center;gap:4px;font-size:0.78rem;font-weight:700;cursor:pointer;">
      <input type="checkbox" value="${t.key}" style="width:auto;"> ${t.label}
    </label>`
  ).join('');

  if (eventId) {
    const ev = findEvent(eventId);
    if (ev) {
      document.getElementById('mTime').value     = ev.time     || '';
      document.getElementById('mActivity').value = ev.activity || '';
      document.getElementById('mLocation').value = ev.location || '';
      document.getElementById('mLink').value     = ev.link     || '';
      document.getElementById('mNotes').value    = ev.notes    || '';
      document.getElementById('mEmoji').value    = ev.icon     || '';
      (ev.tags || []).forEach(k => {
        const cb = box.querySelector(`input[value="${k}"]`);
        if (cb) cb.checked = true;
      });
    }
  } else {
    ['mTime','mActivity','mLocation','mLink','mNotes'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('mEmoji').value = '📌';
  }

  document.getElementById('eventModal').classList.add('open');
}

function closeModal() {
  document.getElementById('eventModal').classList.remove('open');
  editingEventId = null;
  editingDayForNewEvent = null;
}

function saveEvent() {
  const tags = Array.from(document.querySelectorAll('#tagCheckboxes input:checked')).map(cb => cb.value);
  const evData = {
    time:     document.getElementById('mTime').value.trim(),
    activity: document.getElementById('mActivity').value.trim(),
    location: document.getElementById('mLocation').value.trim(),
    link:     document.getElementById('mLink').value.trim(),
    notes:    document.getElementById('mNotes').value.trim(),
    icon:     document.getElementById('mEmoji').value.trim() || '📌',
    tags,
  };
  if (!evData.activity) { alert('Activity name is required!'); return; }

  if (editingEventId) {
    data.forEach(day => day.events.forEach(ev => {
      if (ev.id === editingEventId) Object.assign(ev, evData);
    }));
  } else {
    const day = data.find(d => d.id === editingDayForNewEvent);
    if (day) day.events.push({ id: 'e' + Date.now(), ...evData });
  }

  saveData(data);
  renderAll();
  closeModal();
}

// ── Day Modal ─────────────────────────────────────────────────────────
function openDayModal(dayId, e) {
  e.stopPropagation();
  editingDayId = dayId;
  const day = data.find(d => d.id === dayId);
  document.getElementById('dName').value  = day ? day.name  : '';
  document.getElementById('dEmoji').value = day ? day.emoji : '📅';
  document.getElementById('dayModal').classList.add('open');
}

function closeDayModal() {
  document.getElementById('dayModal').classList.remove('open');
  editingDayId = null;
}

function saveDay() {
  const day = data.find(d => d.id === editingDayId);
  if (day) {
    day.name  = document.getElementById('dName').value.trim()  || day.name;
    day.emoji = document.getElementById('dEmoji').value.trim() || '📅';
  }
  saveData(data);
  renderAll();
  closeDayModal();
}

// ── Delete event ──────────────────────────────────────────────────────
function deleteEvent(eventId) {
  if (!confirm('Remove this event?')) return;
  data.forEach(day => { day.events = day.events.filter(ev => ev.id !== eventId); });
  saveData(data);
  renderAll();
}

function findEvent(id) {
  for (const day of data) {
    const ev = day.events.find(e => e.id === id);
    if (ev) return ev;
  }
  return null;
}

// ── Modal overlay close ───────────────────────────────────────────────
document.getElementById('eventModal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.getElementById('dayModal').addEventListener('click',   function(e) { if (e.target === this) closeDayModal(); });
document.getElementById('pwModal').addEventListener('click',    function(e) { if (e.target === this) closePwModal(); });

// ── Floating stars ────────────────────────────────────────────────────
(function () {
  const container = document.getElementById('stars');
  const icons = ['⭐','🌟','💫','✨','🌸','💜','🎀','🦋','🌈','💕','🍭'];
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.className = 'star-el';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left              = Math.random() * 100 + 'vw';
    el.style.animationDuration = (12 + Math.random() * 16) + 's';
    el.style.animationDelay    = -(Math.random() * 20) + 's';
    el.style.fontSize          = (14 + Math.random() * 14) + 'px';
    container.appendChild(el);
  }
})();

// ── Init ──────────────────────────────────────────────────────────────
renderAll();
