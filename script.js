/**
 * Nature Green Wedding Invitation
 * Korean Mobile 청첩장 - Script
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
      Utility Helpers
     ═══════════════════════════════════════════ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours < 12 ? '오전' : '오후';
    const h12 = hours % 12 || 12;
    const minuteStr = minutes > 0 ? ` ${minutes}분` : '';
    return `${year}년 ${month}월 ${date}일 ${day}요일 ${period} ${h12}시${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

  /* ═══════════════════════════════════════════
      Image Auto-Detection
     ═══════════════════════════════════════════ */

  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
        const images = [];
        let current = 1;
        let consecutiveFails = 0;

        function tryNext() {
            if (current > maxAttempts || consecutiveFails >= 3) {
                resolve(images);
                return;
            }
            const img = new Image();
            const path = `images/${folder}/${current}.jpg`;
            img.onload = function() {
                images.push(path);
                consecutiveFails = 0;
                current++;
                tryNext();
            };
            img.onerror = function() {
                consecutiveFails++;
                current++;
                tryNext();
            };
            img.src = path;
        }

        tryNext();
    });
  }

  /* ═══════════════════════════════════════════
      Toast
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
  }

  /* ═══════════════════════════════════════════
      Clipboard
     ═══════════════════════════════════════════ */

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(successMsg || '복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  }

  /* ═══════════════════════════════════════════
      OG Meta Tags
     ═══════════════════════════════════════════ */

  function setMetaTags() {
    const m = CONFIG.meta;
    document.title = m.title;
    const setMeta = (attr, val, content) => {
      const el = document.querySelector(`meta[${attr}="${val}"]`);
      if (el) el.setAttribute('content', content);
    };
    setMeta('property', 'og:title', m.title);
    setMeta('property', 'og:description', m.description);
    setMeta('property', 'og:image', 'images/og/1.jpg');
    setMeta('name', 'description', m.description);
  }

  /* ═══════════════════════════════════════════
      Curtain (초대장 열기)
     ═══════════════════════════════════════════ */

  function initCurtain() {
    const curtain = $('#curtain');
    const btn = $('#curtainBtn');
    const namesEl = $('#curtainNames');

    if (!curtain) return;

    if (CONFIG.useCurtain === false) {
      curtain.style.display = 'none';
      initFallingLeaves();
      return;
    }

    if (namesEl) {
      namesEl.textContent = `${CONFIG.groom.name}  &  ${CONFIG.bride.name}`;
    }

    if (btn) {
      btn.addEventListener('click', () => {
        curtain.classList.add('is-open');
        document.body.classList.remove('no-scroll');
        setTimeout(() => {
          curtain.classList.add('is-hidden');
          initFallingLeaves();
        }, 1400);
      });
    }

    document.body.classList.add('no-scroll');
  }

  /* ═══════════════════════════════════════════
      Falling Leaves Animation
     ═══════════════════════════════════════════ */

  function initFallingLeaves() {
    const canvas = $('#leafCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const leaves = [];
    const LEAF_COUNT = 20;

    const leafColors = [
      { fill: 'rgba(139, 158, 126, 0.6)', stroke: 'rgba(74, 94, 59, 0.3)' },
      { fill: 'rgba(74, 94, 59, 0.5)', stroke: 'rgba(58, 75, 46, 0.3)' },
      { fill: 'rgba(168, 184, 158, 0.5)', stroke: 'rgba(139, 158, 126, 0.3)' },
      { fill: 'rgba(180, 165, 120, 0.5)', stroke: 'rgba(139, 115, 85, 0.3)' },
      { fill: 'rgba(160, 175, 130, 0.5)', stroke: 'rgba(100, 120, 70, 0.3)' },
    ];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Leaf {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height * -1 : -30;
        this.size = 10 + Math.random() * 14;
        this.speedY = 0.4 + Math.random() * 0.8;
        this.speedX = -0.2 + Math.random() * 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.025;
        this.oscillateAmp = 25 + Math.random() * 35;
        this.oscillateSpeed = 0.008 + Math.random() * 0.015;
        this.oscillateOffset = Math.random() * Math.PI * 2;
        this.opacity = 0.15 + Math.random() * 0.35;
        this.t = 0;
        this.colorSet = leafColors[Math.floor(Math.random() * leafColors.length)];
        this.leafType = Math.floor(Math.random() * 3);
      }

      update() {
        this.t++;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.t * this.oscillateSpeed + this.oscillateOffset) * 0.4;
        this.rotation += this.rotSpeed;
        if (this.y > height + 30) this.reset();
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        const s = this.size;

        if (this.leafType === 0) {
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.5);
          ctx.bezierCurveTo(s * 0.5, -s * 0.4, s * 0.5, s * 0.4, 0, s * 0.5);
          ctx.bezierCurveTo(-s * 0.5, s * 0.4, -s * 0.5, -s * 0.4, 0, -s * 0.5);
          ctx.fillStyle = this.colorSet.fill;
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.45);
          ctx.lineTo(0, s * 0.45);
          ctx.strokeStyle = this.colorSet.stroke;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else if (this.leafType === 1) {
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.6);
          ctx.bezierCurveTo(s * 0.4, -s * 0.2, s * 0.35, s * 0.3, 0, s * 0.6);
          ctx.bezierCurveTo(-s * 0.35, s * 0.3, -s * 0.4, -s * 0.2, 0, -s * 0.6);
          ctx.fillStyle = this.colorSet.fill;
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.5);
          ctx.lineTo(0, s * 0.5);
          ctx.strokeStyle = this.colorSet.stroke;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.ellipse(0, 0, s * 0.35, s * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = this.colorSet.fill;
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.4);
          ctx.lineTo(0, s * 0.4);
          ctx.moveTo(0, -s * 0.1);
          ctx.lineTo(s * 0.2, -s * 0.25);
          ctx.moveTo(0, 0.1);
          ctx.lineTo(-s * 0.2, -s * 0.05);
          ctx.strokeStyle = this.colorSet.stroke;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < LEAF_COUNT; i++) {
      leaves.push(new Leaf());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      leaves.forEach(l => {
        l.update();
        l.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ═══════════════════════════════════════════
      Hero Section
     ═══════════════════════════════════════════ */

  function initHero() {
    const photo = $('#heroPhoto');
    if (photo) photo.src = 'images/hero/1.jpg';
    
    const names = $('#heroNames');
    if (names) names.textContent = `${CONFIG.groom.name}  ·  ${CONFIG.bride.name}`;
    
    const date = $('#heroDate');
    if (date) date.textContent = formatDate(CONFIG.wedding.date, CONFIG.wedding.time);
    
    const venue = $('#heroVenue');
    if (venue) venue.textContent = CONFIG.wedding.venue;
  }

  /* ═══════════════════════════════════════════
      Countdown
     ═══════════════════════════════════════════ */

  function initCountdown() {
    const target = getWeddingDateTime();

    function update() {
      const now = new Date();
      const diff = target - now;
      const labelEl = $('#countdownLabel');
      if (!labelEl) return;

      if (diff <= 0) {
        if ($('#countDays')) $('#countDays').textContent = '0';
        if ($('#countHours')) $('#countHours').textContent = '0';
        if ($('#countMinutes')) $('#countMinutes').textContent = '0';
        if ($('#countSeconds')) $('#countSeconds').textContent = '0';
        labelEl.textContent = '결혼식이 시작되었습니다';
        return;
      }

      const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      labelEl.textContent = `결혼식까지 D-${totalDays}`;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if ($('#countDays')) $('#countDays').textContent = days;
      if ($('#countHours')) $('#countHours').textContent = String(hours).padStart(2, '0');
      if ($('#countMinutes')) $('#countMinutes').textContent = String(minutes).padStart(2, '0');
      if ($('#countSeconds')) $('#countSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════════
      Greeting Section
     ═══════════════════════════════════════════ */

  function initGreeting() {
    if ($('#greetingTitle')) $('#greetingTitle').textContent = CONFIG.greeting.title;
    if ($('#greetingContent')) $('#greetingContent').textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function parentLine(father, mother, fatherDeceased, motherDeceased) {
      const fd = fatherDeceased ? ' deceased' : '';
      const md = motherDeceased ? ' deceased' : '';
      return `<span class="${fd}">${father}</span> · <span class="${md}">${mother}</span>`;
    }

    const parentsHTML = `
      <div class="parent-row">
        ${parentLine(g.father, g.mother, g.fatherDeceased, g.motherDeceased)}
        <span class="parent-dot">●</span>
        의 아들 <span class="child-name">${g.name}</span>
      </div>
      <div class="parent-row">
        ${parentLine(b.father, b.mother, b.fatherDeceased, b.motherDeceased)}
        <span class="parent-dot">●</span>
        의 딸 <span class="child-name">${b.name}</span>
      </div>
    `;

    if ($('#greetingParents')) $('#greetingParents').innerHTML = parentsHTML;
  }

  /* ═══════════════════════════════════════════
      Calendar Section
     ═══════════════════════════════════════════ */

  function initCalendar()
