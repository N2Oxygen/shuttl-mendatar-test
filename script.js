// Mendatar Bus System — script.js
// Flow: Login → Pusat → Jadwal → RFID → Tracking → Summary

function showPage(id) {
  // Only toggle top-level pages, NOT tab content inside dashboard
  document.getElementById('page-login')?.classList.remove('active');
  document.getElementById('page-dashboard')?.classList.remove('active');
  const el = document.getElementById('page-' + id);
  if (el) el.classList.add('active');
}

window.onload = () => {
  showPage('login');
};



function switchTab(tab) {
  // Show dashboard first
  showPage('dashboard');

  // Nav highlight
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
  const map = { pusat: 0, rfid: 1, tracking: 2, summary: 3, jadwal: 0 };
  const items = document.querySelectorAll('.sidebar-nav .nav-item');
  if (map[tab] !== undefined && items[map[tab]]) items[map[tab]].classList.add('active');

  // Tab content
  document.querySelectorAll('[id^="tab-"]').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('tab-' + tab);
  if (t) { t.classList.add('active'); t.style.animation = 'fadeIn .3s ease-out'; }

  // Topbar
  const titles = { pusat:'Beranda — Pusat', jadwal:'Jadwal & Titik Jemput', rfid:'RFID Check-in', tracking:'Tracking Bus Live', summary:'Histori Perjalanan', profile:'Profil Karyawan' };
  const tt = document.getElementById('topbar-title');
  if (tt) tt.textContent = titles[tab] || 'Beranda';

  document.querySelector('.sidebar')?.classList.remove('open');
}

function selectShift(el) {
  document.querySelectorAll('.shift-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function toggleRouteDetail(el, name) {
  const detail = el.querySelector('.route-detail');
  const chevron = el.querySelector('.route-chevron svg');
  
  // Update the top info boxes regardless of toggle state
  const btnBerangkatJam = document.getElementById('info-berangkat-jam');
  const btnPulangJam = document.getElementById('info-pulang-jam');

  if (btnBerangkatJam && btnPulangJam) {
    if (name === 'Johar') {
      btnBerangkatJam.textContent = '05:30 WIB';
      btnPulangJam.textContent = '16:15 WIB';
    } else if (name === 'Lamaran') {
      btnBerangkatJam.textContent = '05:45 WIB';
      btnPulangJam.textContent = '16:30 WIB';
    } else if (name === 'ByPass') {
      btnBerangkatJam.textContent = '05:50 WIB';
      btnPulangJam.textContent = '16:35 WIB';
    }
  }

  // Toggle Accordion
  if (!el.classList.contains('active')) {
    // Close others
    document.querySelectorAll('.route-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.route-chevron svg').forEach(c => c.style.transform = 'rotate(0deg)');
    
    // Open this
    el.classList.add('active');
    chevron.style.transform = 'rotate(90deg)';
    chevron.style.transition = 'transform 0.3s ease';
  } else {
    // Close this
    el.classList.remove('active');
    chevron.style.transform = 'rotate(0deg)';
  }
}

function toggleSchedule(type, index) {
  const tabs = document.querySelectorAll('#schedule-tabs .tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  tabs[index].classList.add('active');
  
  const slider = document.querySelector('.tab-slider');
  if (slider) {
    slider.style.transform = `translateX(${index * 100}%)`;
  }
}
let rfidDone = false;
function simulateRFID() {
  if (rfidDone) return;
  rfidDone = true;

  const badge = document.getElementById('rfid-status-badge');
  badge.className = 'rfid-badge on';
  badge.innerHTML = '<span class="rfid-dot"></span> RFID OK';

  const circle = document.getElementById('rfid-circle');
  circle.className = 'rfid-status-circle ok';
  circle.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';

  document.getElementById('rfid-heading').textContent = 'Deteksi Berhasil!';
  document.getElementById('rfid-subtext').textContent = 'Selamat Bekerja';

  [['rfid-nik','MDT-01'],['rfid-time','05:28 WIB'],['rfid-rute','Johar']].forEach(([id,val],i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      el.textContent = val; el.className = 'rfid-detail-value';
    }, i * 200);
  });

  setTimeout(() => switchTab('tracking'), 2000);
}

function toggleRemember(el) { el.classList.toggle('checked'); }
function toggleSidebar() { document.querySelector('.sidebar')?.classList.toggle('open'); }

const historyData = [
  { group: 'Hari Ini — Senin, 19 Mei 2026', route: 'Johar → PT Mendatar (KIIC)', shift: '1', date: 'Senin, 19 Mei 2026', t1: '05:28 WIB', t2: '05:30 WIB', t3: '06:15 WIB', plat: 'K 3550 KU', ok: true },
  { group: 'Minggu, 18 Mei 2026', route: 'Johar → PT Mendatar (KIIC)', shift: '1', date: 'Minggu, 18 Mei 2026', t1: '05:32 WIB', t2: '05:35 WIB', t3: '06:20 WIB', plat: 'K 3550 KU', ok: true },
  { group: 'Sabtu, 17 Mei 2026', route: 'Lamaran → PT Mendatar (KIIC)', shift: '2', date: 'Sabtu, 17 Mei 2026', t1: '13:45 WIB', t2: '13:50 WIB', t3: '14:30 WIB', plat: 'K 2110 AB', ok: true },
  { group: 'Jumat, 16 Mei 2026', route: 'Johar → PT Mendatar (KIIC)', shift: '1', date: 'Jumat, 16 Mei 2026', t1: '05:30 WIB', t2: '05:32 WIB', t3: '06:18 WIB', plat: 'K 3550 KU', ok: true },
  { group: 'Jumat, 16 Mei 2026', route: 'PT Mendatar (KIIC) → Johar', shift: '1', date: 'Jumat, 16 Mei 2026', t1: '16:05 WIB', t2: '16:10 WIB', t3: '16:55 WIB', plat: 'K 3550 KU', ok: true },
  { group: 'Kamis, 15 Mei 2026', route: 'Johar → PT Mendatar (KIIC)', shift: '1', date: 'Kamis, 15 Mei 2026', t1: '-', t2: '-', t3: '-', plat: '-', ok: false }
];

function renderHistoryList() {
  const container = document.getElementById('history-list-container');
  if (!container) return;
  
  let html = '';
  let currentGroup = '';
  
  historyData.forEach(item => {
    if (item.group !== currentGroup) {
      html += `<div class="history-date">${item.group}</div>`;
      currentGroup = item.group;
    }
    
    const badgeHtml = item.ok ? `<span class="history-badge ok" style="display:inline-block">Sukses</span>` : `<span class="history-badge miss" style="display:inline-block">Tidak Ada</span>`;
    const missClass = item.ok ? '' : 'miss';
    const statusColor = item.ok ? 'var(--green-ok)' : '#ef4444';
    const statusText = item.ok ? 'Selesai & Sukses' : 'RFID Tidak Terdeteksi';
    const dotClass = item.ok ? 'done' : '';
    
    html += `
      <div style="background:var(--white); border:1.5px solid var(--gray-200); border-radius:var(--radius); overflow:hidden; transition:transform 0.3s, border-color 0.3s; margin-bottom:12px;">
        <div class="history-card ${missClass}" onclick="toggleHistoryAccordion(this)" style="border:none; border-radius:0; box-shadow:none; margin:0; align-items:flex-start;">
          <div class="history-shift">${item.shift}</div>
          <div class="history-info">
            <div class="history-route">${item.route}</div>
            <div class="history-meta" style="display:flex; flex-direction:column; gap:4px; margin-top:8px;">
              ${item.ok ? `
                <span><strong>RFID:</strong> ${item.t1}</span>
                <span><strong>Tiba:</strong> ${item.t3}</span>
                <span><strong>Plat:</strong> ${item.plat}</span>
              ` : '<span>RFID tidak terdeteksi · Shift 1</span>'}
            </div>
            <div style="margin-top:12px;">${badgeHtml}</div>
          </div>
          <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="2" style="transition:transform 0.3s; margin-top:4px;"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="history-detail-dropdown" style="max-height:0; overflow:hidden; transition:max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1); background:var(--gray-50);">
          <div style="padding: 20px; border-top: 1px solid var(--gray-200);">
            <div class="info-box" style="margin-bottom: 20px;">
              <div class="info-box-label">Status Perjalanan</div>
              <div class="info-box-text" style="font-weight:700; color:${statusColor}">${statusText}</div>
            </div>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-left"><div class="tl-dot ${dotClass}"></div><div class="tl-line"></div></div>
                <div class="tl-content"><div class="tl-time">${item.t1}</div><div class="tl-name">RFID Tap Check-in</div></div>
              </div>
              <div class="timeline-item">
                <div class="timeline-left"><div class="tl-dot ${dotClass}"></div><div class="tl-line"></div></div>
                <div class="tl-content"><div class="tl-time">${item.t2}</div><div class="tl-name">Bus Berangkat</div></div>
              </div>
              <div class="timeline-item">
                <div class="timeline-left"><div class="tl-dot ${dotClass}"></div></div>
                <div class="tl-content"><div class="tl-time">${item.t3}</div><div class="tl-name">Tiba di Lokasi</div></div>
              </div>
            </div>
            <div style="border-top: 1px solid var(--gray-200); margin-top: 20px; padding-top: 16px;">
               <div class="plate-label">Kendaraan & Plat Nomor</div>
               <div class="plate-number" style="font-size:18px;">${item.plat}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function toggleHistoryAccordion(el) {
  const dropdown = el.nextElementSibling;
  const chevron = el.querySelector('.chevron');
  const allDropdowns = document.querySelectorAll('.history-detail-dropdown');
  const allChevrons = document.querySelectorAll('.history-card .chevron');

  // Close others
  allDropdowns.forEach(d => {
    if (d !== dropdown && d.style.maxHeight && d.style.maxHeight !== '0px') {
      d.style.maxHeight = '0';
    }
  });
  allChevrons.forEach(c => {
    if (c !== chevron) c.style.transform = 'rotate(0deg)';
  });

  if (dropdown.style.maxHeight && dropdown.style.maxHeight !== '0px') {
    dropdown.style.maxHeight = '0';
    chevron.style.transform = 'rotate(0deg)';
  } else {
    dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
    chevron.style.transform = 'rotate(180deg)';
  }
}

function toggleNotifications() {
  const panel = document.getElementById('notif-panel');
  if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function filterRoutes(q) {
  document.querySelectorAll('.route-card').forEach(card => {
    const name = card.querySelector('.route-name')?.textContent.toLowerCase() || '';
    card.style.display = name.includes(q.toLowerCase().trim()) ? 'flex' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const si = document.querySelector('.search-input');
  if (si) si.addEventListener('input', e => filterRoutes(e.target.value));
  
  renderHistoryList();

  // Auto date
  const d = document.querySelector('.topbar-subtitle');
  if (d) {
    const now = new Date();
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    d.textContent = `Jadwal Normal · ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  // Close sidebar or notifications on outside click
  document.addEventListener('click', e => {
    const sb = document.querySelector('.sidebar');
    const hb = document.querySelector('.hamburger');
    if (sb?.classList.contains('open') && !sb.contains(e.target) && !hb?.contains(e.target)) sb.classList.remove('open');

    const notifPanel = document.getElementById('notif-panel');
    const notifBtn = document.querySelector('.btn-icon[title="Notifikasi"]');
    if (notifPanel && notifPanel.style.display === 'block' && !notifPanel.contains(e.target) && !notifBtn?.contains(e.target)) {
      notifPanel.style.display = 'none';
    }
  });

  // Schedule tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
