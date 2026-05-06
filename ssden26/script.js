/* ========================================
   Schedule Renderer
   Loads schedule.json and builds the UI
   ======================================== */

let navEl = null;
let scheduleEl = null;

document.addEventListener('DOMContentLoaded', () => {
    scheduleEl = document.getElementById('schedule');
    navEl = document.querySelector('.day-nav');

    if (!scheduleEl || !navEl) {
        console.error('Could not find required elements');
        return;
    }

    // Show loading state
    scheduleEl.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading itinerary...</p>
        </div>
    `;

    fetch('schedule.json')
        .then(response => {
            if (!response.ok) throw new Error('Could not load schedule');
            return response.json();
        })
        .then(days => {
            renderNav(days);
            renderSchedule(days);
            observeNav();
        })
        .catch(err => {
            if (scheduleEl) {
                scheduleEl.innerHTML = `
                    <div class="error">
                        <h3>Something went wrong</h3>
                        <p>${err.message}</p>
                    </div>
                `;
            }
            console.error('Failed to load schedule:', err);
        });
});

/* ========================================
   Parse date header into parts
   ======================================== */

function parseDateHeader(header) {
    const parts = header.split('-');
    const datePart = parts[0].trim();
    const dayName = parts.length > 1 ? parts.slice(1).join('-').trim() : '';
    const [month, day, year] = datePart.split('/').map(Number);
    return { month, day, year, dayName };
}

/* ========================================
   Render day navigation bar
   ======================================== */

function renderNav(days) {
    if (!navEl) return;
    const inner = document.createElement('div');
    inner.className = 'day-nav-inner';

    days.forEach((day, index) => {
        const parsed = parseDateHeader(day.date_header);
        const btn = document.createElement('a');
        btn.href = `#day-${index}`;
        btn.className = 'day-nav-btn';
        btn.dataset.target = `day-${index}`;
        btn.innerHTML = `
            <span class="nav-day">${parsed.day}</span>
            <span class="nav-name">${parsed.dayName}</span>
        `;
        inner.appendChild(btn);
    });

    navEl.appendChild(inner);
}

/* ========================================
   Render all day sections
   ======================================== */

function renderSchedule(days) {
    if (!scheduleEl) return;
    scheduleEl.innerHTML = '';

    days.forEach((day, index) => {
        const section = document.createElement('section');
        section.className = 'day-section';
        section.id = `day-${index}`;

        const parsed = parseDateHeader(day.date_header);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthAbbr = monthNames[parsed.month - 1];

        const headerHTML = `
            <div class="day-header">
                <div class="day-date-badge">
                    <span class="badge-month">${monthAbbr}</span>
                    <span class="badge-day">${parsed.day}</span>
                    <span class="badge-year">${parsed.year}</span>
                </div>
                <div class="day-title">
                    <h2>${parsed.dayName}</h2>
                    ${day.details ? `<div class="day-details">${escapeHtml(day.details)}</div>` : ''}
                </div>
            </div>
        `;

        let activitiesHTML = '<div class="activities">';
        day.activities.forEach(activity => {
            activitiesHTML += renderActivity(activity);
        });
        activitiesHTML += '</div>';

        section.innerHTML = headerHTML + activitiesHTML;
        scheduleEl.appendChild(section);
    });
}

/* ========================================
   Render a single activity card
   ======================================== */

function renderActivity(a) {
    let cardClass = 'activity-card';
    let badgeHTML = '';

    const isOptional = a.activity === 'Optional';
    const isContinued = a.activity === 'Continued';

    if (isOptional) cardClass += ' optional';
    if (isContinued) cardClass += ' continued';

    if (isOptional) badgeHTML = '<span class="optional-badge">Optional</span>';
    if (isContinued) badgeHTML = '<span class="continued-badge">Continued</span>';

    const timeHTML = a.time
        ? `<div class="activity-time"><span class="time-icon">◷</span>${escapeHtml(a.time)}</div>`
        : '<div class="activity-time"></div>';

    const locationHTML = a.location
        ? `<div class="activity-location"><span class="loc-icon">◎</span>${escapeHtml(a.location)}</div>`
        : '';

    const nameHTML = a.activity
        ? `<div class="activity-name">${escapeHtml(a.activity)}</div>`
        : '';

    const detailsHTML = a.details
        ? `<div class="activity-details">${escapeHtml(a.details)}</div>`
        : '';

    const linkHTML = a.link
        ? `<a href="${escapeHtml(a.link)}" class="activity-link" target="_blank" rel="noopener noreferrer"><span class="link-icon">↗</span>More Info</a>`
        : '';

    return `
        <div class="${cardClass}">
            ${timeHTML}
            <div class="activity-content">
                ${badgeHTML}
                ${locationHTML}
                ${nameHTML}
                ${detailsHTML}
                ${linkHTML}
            </div>
        </div>
    `;
}

/* ========================================
   Scroll spy — highlight active nav button
   ======================================== */

function observeNav() {
    const sections = document.querySelectorAll('.day-section');
    const navBtns = document.querySelectorAll('.day-nav-btn');

    if (sections.length === 0 || navBtns.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.target === id);
                    if (btn.dataset.target === id) {
                        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

/* ========================================
   Utility: escape HTML
   ======================================== */

function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
