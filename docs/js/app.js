// Navigation
function navigateTo(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector('.nav-links a[data-section="' + id + '"]');
  if (link) link.classList.add('active');
  window.scrollTo({ top: document.querySelector('.main-nav').offsetTop, behavior: 'smooth' });
}
window.navigateTo = navigateTo;

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo(this.getAttribute('data-section'));
    // Close mobile menu
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Mobile nav toggle
document.getElementById('navToggle').addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('open');
});

// Code fold
document.querySelectorAll('.code-toggle').forEach(btn => {
  btn.addEventListener('click', function() {
    const block = this.nextElementSibling;
    if (block) {
      block.classList.toggle('collapsed');
      const lang = document.querySelector('.lang-btn.active').dataset.lang;
      if (block.classList.contains('collapsed')) {
        this.textContent = lang === 'zh' ? this.dataset.zh : this.dataset.en;
      } else {
        this.textContent = lang === 'zh' ? '收起代码' : 'Collapse code';
      }
    }
  });
});

// Language toggle
let currentLang = 'zh';
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    currentLang = this.dataset.lang;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    // Update all translatable elements
    document.querySelectorAll('[data-zh]').forEach(el => {
      const text = currentLang === 'zh' ? el.dataset.zh : el.dataset.en;
      if (el.dataset.isQuote) {
        el.textContent = text;
      } else if (el.tagName === 'A' || el.tagName === 'SPAN' || el.tagName === 'P' || el.tagName === 'STRONG' || el.tagName === 'H3' || el.tagName === 'H2') {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });
    // Update code toggle buttons
    document.querySelectorAll('.code-toggle').forEach(btn => {
      const block = btn.nextElementSibling;
      if (block && block.classList.contains('collapsed')) {
        btn.textContent = currentLang === 'zh' ? btn.dataset.zh : btn.dataset.en;
      } else if (block) {
        btn.textContent = currentLang === 'zh' ? '收起代码' : 'Collapse code';
      }
    });
    // Update html lang
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  });
});

// Hash navigation
if (window.location.hash) {
  const id = window.location.hash.substring(1);
  navigateTo(id);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const sections = ['overview', 'harness', 'skills', 'patterns', 'files'];
  const current = document.querySelector('.nav-links a.active');
  let idx = sections.indexOf(current?.dataset.section || 'overview');
  if (e.key === 'ArrowRight' || e.key === 'l') {
    idx = Math.min(idx + 1, sections.length - 1);
    navigateTo(sections[idx]);
  } else if (e.key === 'ArrowLeft' || e.key === 'h') {
    idx = Math.max(idx - 1, 0);
    navigateTo(sections[idx]);
  }
});

console.log('🔧 Claude Code Harness Engineering & Skills Analysis loaded');
console.log('Navigate: ←→ or h/l | Sections: overview | harness | skills | patterns | files');
