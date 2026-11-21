(function () {
  'use strict';

  /* 图标已内联为静态 SVG，无需运行时图标库 */

  /* ---------- 导航滚动背景 ---------- */
  var header = document.getElementById('siteHeader');
  function syncHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  /* ---------- 滚动入场 ---------- */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children).filter(function (n) { return n.classList.contains('reveal'); }) : [];
        var delay = Math.max(0, siblings.indexOf(el)) * 70;
        setTimeout(function () { el.classList.add('in'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 项目悬停图片预览 ---------- */
  var preview = document.getElementById('ledgerPreview');
  var previewImg = preview ? preview.querySelector('img') : null;
  var cards = document.querySelectorAll('.project-card');
  cards.forEach(function (card) {
    function show() {
      if (!preview || !previewImg || window.innerWidth <= 900) return;
      var src = card.getAttribute('data-preview');
      if (src && previewImg.getAttribute('src') !== src) previewImg.setAttribute('src', src);
      var wrap = card.closest('.ledger-wrap');
      if (!wrap) return;
      var cardRect = card.getBoundingClientRect();
      var wrapRect = wrap.getBoundingClientRect();
      preview.style.top = (cardRect.top - wrapRect.top) + 'px';
      preview.classList.add('visible');
    }
    function hide() { if (preview) preview.classList.remove('visible'); }
    card.addEventListener('mouseenter', show);
    card.addEventListener('mouseleave', hide);
    card.addEventListener('focus', show);
    card.addEventListener('blur', hide);
  });

  /* ---------- 复制邮箱 + Toast ---------- */
  var copyBtn = document.getElementById('copyEmail');
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message, isError) {
    if (!toast) return;
    var label = toast.querySelector('.toast-label');
    if (label) label.textContent = message;
    var ico = toast.querySelector('.toast-ico');
    if (ico) ico.style.color = isError ? '#fb7185' : '#22d3ee';
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || '';
      function done(ok) {
        if (ok) {
          var ico = copyBtn.querySelector('svg');
          var CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
          var COPY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
          if (ico) ico.outerHTML = CHECK_SVG;
          showToast('邮箱已复制到剪贴板', false);
          setTimeout(function () {
            var check = copyBtn.querySelector('svg');
            if (check) check.outerHTML = COPY_SVG;
          }, 2200);
        } else {
          showToast('复制失败，请手动选择邮箱', true);
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done(true); }).catch(function () { done(fallbackCopy(email)); });
      } else {
        done(fallbackCopy(email));
      }
    });
  }

  /* ---------- 平滑锚点（兼容固定头） ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
