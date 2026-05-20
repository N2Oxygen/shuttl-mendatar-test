// Mendatar Bus System — script.js
// Flow: Login → Pusat → Jadwal → RFID → Tracking → Summary

function showPage(id) {
  // Only toggle top-level pages, NOT tab content inside dashboard
  document.getElementById('page-login')?.classList.remove('active');
  document.getElementById('page-dashboard')?.classList.remove('active');
  const el = document.getElementById('page-' + id);
  if (el) el.classList.add('active');
}

function switchTab(tab) {
  // Show dashboard first
  showPage('dashboard');

  // Nav highlight
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
  const map = { pusat: 0, jadwal: 1, rfid: 2, tracking: 3, summary: 4 };
  const items = document.querySelectorAll('.sidebar-nav .nav-item');
  if (map[tab] !== undefined && items[map[tab]]) items[map[tab]].classList.add('active');

  // Tab content
  document.querySelectorAll('[id^="tab-"]').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('tab-' + tab);
  if (t) { t.classList.add('active'); t.style.animation = 'fadeIn .3s ease-out'; }

  // Topbar
  const titles = { pusat:'Beranda — Pusat', jadwal:'Jadwal & Titik Jemput', rfid:'RFID Check-in', tracking:'Tracking Bus Live', summary:'Histori Perjalanan' };
  const tt = document.getElementById('topbar-title');
  if (tt) tt.textContent = titles[tab] || 'Beranda';

  document.querySelector('.sidebar')?.classList.remove('open');
}

function selectShift(el) {
  document.querySelectorAll('.shift-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function selectRoute(el, name) {
  document.querySelectorAll('.route-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  // Auto navigate to jadwal detail
  switchTab('jadwal');
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

  document.getElementById('rfid-badge-top').className = 'rfid-badge on';
  document.getElementById('rfid-badge-top').innerHTML = '<span class="rfid-dot"></span> RFID On';

  setTimeout(() => switchTab('tracking'), 2000);
}

function toggleRemember(el) { el.classList.toggle('checked'); }
function toggleSidebar() { document.querySelector('.sidebar')?.classList.toggle('open'); }

function openHistoryDetail(route, shift, date, rfidTime, arriveTime, plat, isSuccess) {
  document.getElementById('history-list-view').style.display = 'none';
  document.getElementById('history-detail-view').style.display = 'block';
  document.getElementById('hist-detail-route').textContent = route;
  document.getElementById('hist-detail-shift').textContent = shift;
  document.getElementById('hist-detail-date').textContent = date;
  document.getElementById('hist-detail-t1').textContent = rfidTime;
  document.getElementById('hist-detail-t3').textContent = arriveTime;
  document.getElementById('hist-detail-plat').textContent = plat;

  const iconDiv = document.getElementById('hist-detail-icon');
  const svg = document.getElementById('hist-icon-svg');
  const status = document.getElementById('hist-detail-status');
  
  if (isSuccess) {
    iconDiv.style.background = 'var(--green-bg)';
    svg.setAttribute('stroke', '#16a34a');
    svg.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
    status.textContent = 'Selesai & Sukses';
    status.style.color = 'var(--green-ok)';
  } else {
    iconDiv.style.background = '#fef2f2';
    svg.setAttribute('stroke', '#ef4444');
    svg.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
    status.textContent = 'RFID Tidak Terdeteksi';
    status.style.color = '#ef4444';
  }
}

function closeHistoryDetail() {
  document.getElementById('history-detail-view').style.display = 'none';
  document.getElementById('history-list-view').style.display = 'block';
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

  // Auto date
  const d = document.querySelector('.topbar-subtitle');
  if (d) {
    const now = new Date();
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    d.textContent = `Jadwal Normal · ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  // Close sidebar on outside click (mobile)
  document.addEventListener('click', e => {
    const sb = document.querySelector('.sidebar');
    const hb = document.querySelector('.hamburger');
    if (sb?.classList.contains('open') && !sb.contains(e.target) && !hb?.contains(e.target)) sb.classList.remove('open');
  });

  // Schedule tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
