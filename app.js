(function () {
  'use strict';

  // ---------- Setup ----------
  const STORAGE_KEY = 'resume-builder-v1';
  const TEMPLATES = ['classic', 'modern', 'timeline'];
  const ORDER = ['summary', 'experience', 'education', 'projects', 'skills', 'certifications'];
  const SECTIONS = {
    summary: { title: 'Summary' },
    experience: { title: 'Experience', one: 'Job' },
    education: { title: 'Education', one: 'Education entry' },
    projects: { title: 'Projects', one: 'Project' },
    skills: { title: 'Skills' },
    certifications: { title: 'Certifications', one: 'Certification' }
  };
  // [key, label, kind] where kind is 'area' (textarea), 'wide' (full-width input) or empty
  const FIELDS = {
    experience: [['role', 'Job title'], ['company', 'Company'], ['location', 'Location'], ['start', 'Start (for example Mar 2021)'], ['end', 'End (or Present)'], ['details', 'Achievements (one per line)', 'area']],
    education: [['degree', 'Degree'], ['school', 'School or university'], ['start', 'Start'], ['end', 'End'], ['details', 'Details (one per line)', 'area']],
    projects: [['name', 'Project name'], ['link', 'Link'], ['tech', 'Technologies', 'wide'], ['details', 'Description (one per line)', 'area']],
    certifications: [['name', 'Certification'], ['issuer', 'Issuer'], ['date', 'Date']]
  };
  const PERSONAL = [['name', 'Full name'], ['title', 'Headline (for example Software Engineer)'], ['email', 'Email'], ['phone', 'Phone'], ['location', 'City, country'], ['website', 'Website or LinkedIn', 'wide']];
  const SCALARS = PERSONAL.map(f => f[0]).concat(['summary', 'skills']);
  const LISTS = Object.keys(FIELDS);

  const $ = id => document.getElementById(id);
  const form = $('form'), paper = $('paper'), pane = $('pane'), statusEl = $('status');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Data ----------
  const emptyItem = key => Object.fromEntries(FIELDS[key].map(f => [f[0], '']));
  function blank(template) {
    const d = { template: template || 'classic', order: ORDER.slice() };
    SCALARS.forEach(k => { d[k] = ''; });
    LISTS.forEach(k => { d[k] = [emptyItem(k)]; });
    return d;
  }
  // Turn any parsed JSON into a safe resume object (unknown or wrong-type values are dropped).
  function normalize(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Not a resume file');
    const d = blank(TEMPLATES.includes(raw.template) ? raw.template : 'classic');
    SCALARS.forEach(k => { if (typeof raw[k] === 'string') d[k] = raw[k]; });
    LISTS.forEach(k => {
      if (!Array.isArray(raw[k])) return;
      d[k] = raw[k].map(it => {
        const o = emptyItem(k);
        FIELDS[k].forEach(f => { if (it && typeof it[f[0]] === 'string') o[f[0]] = it[f[0]]; });
        return o;
      });
    });
    if (Array.isArray(raw.order)) {
      const o = raw.order.filter((k, i) => ORDER.includes(k) && raw.order.indexOf(k) === i);
      d.order = o.concat(ORDER.filter(k => !o.includes(k)));
    }
    return d;
  }

  let data;
  try { data = normalize(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch (e) { data = blank(); }

  function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* storage blocked: ignore */ } }
  let statusTimer;
  function say(msg) {
    statusEl.textContent = msg;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { statusEl.textContent = ''; }, 5000);
  }

  // ---------- Form ----------
  function field(path, label, value, kind) {
    const input = kind === 'area'
      ? `<textarea rows="4" data-path="${path}">${esc(value)}</textarea>`
      : `<input type="text" data-path="${path}" value="${esc(value)}">`;
    return `<label class="${kind ? 'wide' : ''}">${esc(label)}${input}</label>`;
  }

  function cardHTML(key, index) {
    const s = SECTIONS[key];
    let body;
    if (key === 'summary') body = field('summary', 'Professional summary', data.summary, 'area');
    else if (key === 'skills') body = field('skills', 'Skills (separate with commas or new lines)', data.skills, 'area');
    else {
      body = data[key].map((item, i) => `
        <div class="item">
          <h3>${s.one} ${i + 1}</h3>
          <div class="grid">${FIELDS[key].map(f => field(`${key}.${i}.${f[0]}`, f[1], item[f[0]], f[2])).join('')}</div>
          <button type="button" class="btn small danger" data-act="remove" data-key="${key}" data-i="${i}">Remove ${s.one.toLowerCase()} ${i + 1}</button>
        </div>`).join('') +
        `<button type="button" class="btn small" data-act="add" data-key="${key}">Add ${s.one.toLowerCase()}</button>`;
    }
    const last = index === data.order.length - 1;
    return `
      <section class="card" data-key="${key}">
        <header class="card-head" draggable="true" title="Drag to reorder this section">
          <span class="grip" aria-hidden="true"></span>
          <h2>${s.title}</h2>
          <button type="button" class="btn small" data-act="up" data-key="${key}" aria-label="Move ${s.title} up" ${index === 0 ? 'disabled' : ''}>Move up</button>
          <button type="button" class="btn small" data-act="down" data-key="${key}" aria-label="Move ${s.title} down" ${last ? 'disabled' : ''}>Move down</button>
        </header>
        <div class="card-body">${body}</div>
      </section>`;
  }

  function renderForm() {
    form.innerHTML = `
      <section class="card">
        <header class="card-head"><h2>Name and contact</h2></header>
        <div class="card-body"><div class="grid">${PERSONAL.map(f => field(f[0], f[1], data[f[0]], f[2])).join('')}</div></div>
      </section>` + data.order.map(cardHTML).join('');
    $('template').value = data.template;
  }

  // ---------- Preview ----------
  const lines = t => t.split('\n').map(s => s.replace(/^\s*[-*•]\s*/, '').trim()).filter(Boolean);
  const items = t => t.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
  const range = o => [o.start, o.end].filter(Boolean).join(' – ');
  const join = (a, sep) => a.filter(Boolean).join(sep);

  function entry(title, sub, date, bullets) {
    if (!title && !sub && !date && !bullets.length) return '';
    return `<div class="entry"><div class="e-main">
      ${title ? `<div class="e-title">${esc(title)}</div>` : ''}${sub ? `<div class="e-sub">${esc(sub)}</div>` : ''}
      ${bullets.length ? `<ul>${bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      </div><div class="e-date">${esc(date)}</div></div>`;
  }

  const BUILD = {
    summary: d => d.summary.trim() ? `<p class="summary">${esc(d.summary.trim())}</p>` : '',
    skills: d => items(d.skills).length ? `<div class="skills">${items(d.skills).map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>` : '',
    experience: d => d.experience.map(e => entry(e.role, join([e.company, e.location], ', '), range(e), lines(e.details))).join(''),
    education: d => d.education.map(e => entry(e.degree, e.school, range(e), lines(e.details))).join(''),
    projects: d => d.projects.map(p => entry(p.name, join([p.tech, p.link], ' | '), '', lines(p.details))).join(''),
    certifications: d => d.certifications.map(c => entry(c.name, c.issuer, c.date, [])).join('')
  };

  function renderPreview() {
    const d = data;
    const contact = [d.email, d.phone, d.location, d.website].filter(Boolean).map(s => `<span>${esc(s)}</span>`).join('');
    const head = d.name || d.title || contact
      ? `<header class="r-head"><div><h1 class="r-name">${esc(d.name)}</h1>${d.title ? `<div class="r-title">${esc(d.title)}</div>` : ''}</div><div class="r-contact">${contact}</div></header>` : '';
    const body = d.order.map(k => {
      const html = BUILD[k](d);
      return html ? `<section class="sec"><h2 class="sec-title">${SECTIONS[k].title}</h2>${html}</section>` : '';
    }).join('');
    paper.className = 'paper t-' + d.template;
    paper.innerHTML = head + body || '<p class="empty">Your resume appears here as you type. Fill in the form, or press Load sample.</p>';
    document.title = d.name ? d.name + ' - Resume' : 'Resume Builder'; // used as the default PDF file name
    fit();
  }

  // Scale the A4 sheet down to fit narrow screens, and estimate the page count.
  function fit() {
    paper.style.zoom = 1;
    const mmPerPx = 25.4 / 96;
    const contentMm = paper.offsetHeight * mmPerPx - 28; // minus 2 x 14 mm page margin
    const pages = Math.max(1, Math.ceil(contentMm / 269));  // 297 - 28 mm usable height per page
    $('pages').textContent = `A4 preview, about ${pages} page${pages > 1 ? 's' : ''}. Use Print / Save as PDF to see the exact page breaks.`;
    paper.style.zoom = Math.min(1, (pane.clientWidth - 32) / paper.offsetWidth);
  }

  function renderAll() { renderForm(); renderPreview(); }

  // ---------- Events: typing, add, remove, move ----------
  form.addEventListener('input', e => {
    const path = e.target.dataset.path;
    if (!path) return;
    const parts = path.split('.');
    const last = parts.pop();
    parts.reduce((o, p) => o[p], data)[last] = e.target.value;
    persist();
    renderPreview();
  });

  form.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const { act, key } = btn.dataset, i = +btn.dataset.i;
    if (act === 'add') data[key].push(emptyItem(key));
    if (act === 'remove') data[key].splice(i, 1);
    if (act === 'up' || act === 'down') {
      const from = data.order.indexOf(key), to = from + (act === 'up' ? -1 : 1);
      if (to < 0 || to >= data.order.length) return;
      data.order.splice(to, 0, data.order.splice(from, 1)[0]);
    }
    persist();
    renderAll();
    // Keep keyboard focus where the user was working.
    if (act === 'add') form.querySelector(`[data-path="${key}.${data[key].length - 1}.${FIELDS[key][0][0]}"]`).focus();
    if (act === 'up' || act === 'down') {
      const again = form.querySelector(`[data-act="${act}"][data-key="${key}"]:not(:disabled)`) ||
        form.querySelector(`[data-act="${act === 'up' ? 'down' : 'up'}"][data-key="${key}"]`);
      again.focus();
    }
  });

  // ---------- Events: drag and drop sections (mouse) ----------
  let dragKey = null;
  const clearMarks = () => form.querySelectorAll('.drop-before,.drop-after,.dragging').forEach(c => c.classList.remove('drop-before', 'drop-after', 'dragging'));
  const overCard = e => { const c = e.target.closest('.card[data-key]'); return c && c.dataset.key !== dragKey ? c : null; };
  const isAfter = (e, c) => { const r = c.getBoundingClientRect(); return e.clientY > r.top + r.height / 2; };

  form.addEventListener('dragstart', e => {
    const head = e.target.closest && e.target.closest('.card-head[draggable]');
    if (!head) return;
    const card = head.parentElement;
    dragKey = card.dataset.key;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragKey);
    e.dataTransfer.setDragImage(card, 20, 20);
    card.classList.add('dragging');
  });
  form.addEventListener('dragover', e => {
    const c = dragKey && overCard(e);
    if (!c) return;
    e.preventDefault();
    form.querySelectorAll('.drop-before,.drop-after').forEach(x => x.classList.remove('drop-before', 'drop-after'));
    c.classList.add(isAfter(e, c) ? 'drop-after' : 'drop-before');
  });
  form.addEventListener('drop', e => {
    const c = dragKey && overCard(e);
    if (!c) return;
    e.preventDefault();
    data.order = data.order.filter(k => k !== dragKey);
    data.order.splice(data.order.indexOf(c.dataset.key) + (isAfter(e, c) ? 1 : 0), 0, dragKey);
    dragKey = null;
    persist();
    renderAll();
  });
  form.addEventListener('dragend', () => { dragKey = null; clearMarks(); });

  // ---------- Toolbar ----------
  $('template').addEventListener('change', e => { data.template = e.target.value; persist(); renderPreview(); });
  $('printBtn').addEventListener('click', () => window.print());

  $('sampleBtn').addEventListener('click', () => {
    if (!confirm('Replace what is in the form with the sample resume?')) return;
    data = normalize(Object.assign({}, window.SAMPLE, { template: data.template }));
    persist(); renderAll(); say('Sample loaded.');
  });
  $('clearBtn').addEventListener('click', () => {
    if (!confirm('Clear everything in the form? This cannot be undone.')) return;
    data = blank(data.template);
    persist(); renderAll(); say('Form cleared.');
  });

  $('saveBtn').addEventListener('click', () => {
    const name = (data.name || 'resume').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'resume';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = name + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    say('Saved ' + a.download + ' to your downloads folder.');
  });
  $('loadBtn').addEventListener('click', () => $('file').click());
  $('file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { data = normalize(JSON.parse(reader.result)); persist(); renderAll(); say('Loaded ' + file.name + '.'); }
      catch (err) { say('That file is not a valid resume .json file. Nothing was changed.'); }
    };
    reader.readAsText(file);
    e.target.value = ''; // allow loading the same file again
  });

  window.addEventListener('resize', fit);
  renderAll();
})();
