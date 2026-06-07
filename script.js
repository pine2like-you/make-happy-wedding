/**
 * ═══════════════════════════════════════════
 * Nature Green Wedding Invitation
 * 데이터 강제 바인딩 및 유실 방지 최종 스크립트 (2026)
 * ═══════════════════════════════════════════
 */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// 공통 유틸리티: 토스트 알림
function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  setTimeout(() => { toast.classList.remove('is-visible'); }, 2500);
}

// ───────────────────────────────────────────
//  1. CONFIG 데이터 텍스트 및 이미지 매칭 (가장 안전한 방식)
// ───────────────────────────────────────────
function initConfigData() {
  // 전역 CONFIG 객체 확보 (대소문자 및 윈도우 프로퍼티 체크)
  const cfg = window.CONFIG || CONFIG;
  if (!cfg) {
    console.error("CONFIG 데이터를 찾을 수 없습니다. config.js 로드 여부를 확인하세요.");
    return;
  }

  try {
    // [메타 태그 주입]
    if ($('meta[property="og:title"]')) $('meta[property="og:title"]').setAttribute('content', cfg.meta.title || "");
    if ($('meta[property="og:description"]')) $('meta[property="og:description"]').setAttribute('content', cfg.meta.description || "");
    if ($('meta[property="og:image"]')) $('meta[property="og:image"]').setAttribute('content', 'images/og/1.jpg');

    // [커튼 오프닝 이름]
    if ($('#curtainNames')) {
      $('#curtainNames').textContent = `${cfg.groom.name} & ${cfg.bride.name}`;
    }

    // [히어로(메인) 영역]
    if ($('#heroPhoto')) $('#heroPhoto').src = "images/hero/1.jpg";
    if ($('#heroNames')) $('#heroNames').innerHTML = `${cfg.groom.name}<br>&<br>${cfg.bride.name}`;
    
    if (cfg.wedding && cfg.wedding.date) {
      const dateParts = cfg.wedding.date.split('-');
      if (dateParts.length === 3 && $('#heroDate')) {
        $('#heroDate').textContent = `${dateParts[0]}년 ${parseInt(dateParts[1])}월 ${parseInt(dateParts[2])}일 ${cfg.wedding.time || ""}`;
      }
    }
    if ($('#heroVenue') && cfg.wedding) $('#heroVenue').textContent = `${cfg.wedding.venue || ""} ${cfg.wedding.hall || ""}`;

    // [인사말 영역]
    if ($('#greetingTitle') && cfg.greeting) $('#greetingTitle').textContent = cfg.greeting.title || "";
    if ($('#greetingContent') && cfg.greeting) $('#greetingContent').textContent = cfg.greeting.content || "";

    // [오시는 길 영역]
    if (cfg.wedding) {
      if ($('#locationVenue')) $('#locationVenue').textContent = cfg.wedding.venue || "";
      if ($('#locationHall')) $('#locationHall').textContent = cfg.wedding.hall || "";
      if ($('#locationAddress')) $('#locationAddress').textContent = cfg.wedding.address || "";
      if ($('#locationTel')) $('#locationTel').textContent = cfg.wedding.tel ? `Tel. ${cfg.wedding.tel}` : "";
      if ($('#locationMapImg')) $('#locationMapImg').src = "images/location/1.jpg";

      // 지도 앱 연결 링크
      if ($('#kakaoMapBtn') && cfg.wedding.mapLinks) $('#kakaoMapBtn').href = cfg.wedding.mapLinks.kakao || "#";
      if ($('#naverMapBtn') && cfg.wedding.mapLinks) $('#naverMapBtn').href = cfg.wedding.mapLinks.naver || "#";
    }

    // [푸터]
    if ($('#footerText')) $('#footerText').textContent = `Copyright © ${cfg.groom.name} & ${cfg.bride.name}. All Rights Reserved.`;

  } catch (e) {
    console.error("데이터 매칭 중 오류 발생:", e);
  }
}

// ───────────────────────────────────────────
//  2. 커튼 오프닝 제어
// ───────────────────────────────────────────
function initCurtain() {
  const curtain = $('#curtain') || $('.curtain');
  const bgm = document.getElementById('bgm');
  const btn = $('#bgmBtn') || $('.music-btn');
  const cfg = window.CONFIG || CONFIG;

  if (!curtain) return;

  if (cfg && cfg.useCurtain === false) {
    curtain.style.display = 'none';
    document.body.classList.remove('no-scroll');
    return;
  }

  document.body.classList.add('no-scroll');

  const openCurtain = () => {
    curtain.classList.add('is-open');
    document.body.classList.remove('no-scroll');

    if (bgm && btn) {
      bgm.play().then(() => {
        btn.classList.add('is-playing');
        if (btn.querySelector('.icon-mute')) btn.querySelector('.icon-mute').style.display = 'none';
        if (btn.querySelector('.icon-sound')) btn.querySelector('.icon-sound').style.display = 'block';
        showToast('배경음악이 재생됩니다');
      }).catch((err) => {
        console.log('BGM 자동 재생 차단됨:', err);
      });
    }

    setTimeout(() => { 
      curtain.style.display = 'none';
      curtain.classList.add('is-hidden'); 
    }, 1200);
  };

  const anyBtn = curtain.querySelector('button') || $('#curtainBtn') || $('.curtain__btn');
  if (anyBtn) {
    anyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCurtain();
    });
  }
  curtain.addEventListener('click', openCurtain);
}

// ───────────────────────────────────────────
//  3. 배경음악 버튼 작동 제어
// ───────────────────────────────────────────
function initBGM() {
  const bgm = document.getElementById('bgm');
  const btn = $('#bgmBtn') || $('.music-btn');

  if (!bgm || !btn) return;

  const iconMute = btn.querySelector('.icon-mute');
  const iconSound = btn.querySelector('.icon-sound');

  btn.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play().then(() => {
        btn.classList.add('is-playing');
        if (iconMute) iconMute.style.display = 'none';
        if (iconSound) iconSound.style.display = 'block';
        showToast('배경음악이 재생됩니다');
      }).catch(() => {
        showToast('음악 재생에 실패했습니다');
      });
    } else {
      bgm.pause();
      btn.classList.remove('is-playing');
      if (iconMute) iconMute.style.display = 'block';
      if (iconSound) iconSound.style.display = 'none';
      showToast('배경음악이 일시정지되었습니다');
    }
  });
}

// ───────────────────────────────────────────
//  4. 디데이 시계 작동
// ───────────────────────────────────────────
function initCountdown() {
  const countdown = $('#countdown');
  const cfg = window.CONFIG || CONFIG;
  if (!countdown || !cfg || !cfg.wedding) return;

  const weddingTarget = new Date(`${cfg.wedding.date}T${cfg.wedding.time}:00+09:00`).getTime();

  if ($('#countdownLabel')) {
    $('#countdownLabel').textContent = `${cfg.groom.name} ♥ ${cfg.bride.name}의 결혼식이`;
  }

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = weddingTarget - now;

    if (distance < 0) {
      countdown.innerHTML = '<p class="countdown__label">축하해 주셔서 대단히 감사합니다.</p>';
      clearInterval(intervalId);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if ($('#countDays')) $('#countDays').textContent = String(days);
    if ($('#countHours')) $('#countHours').textContent = String(hours).padStart(2, '0');
    if ($('#countMinutes')) $('#countMinutes').textContent = String(minutes).padStart(2, '0');
    if ($('#countSeconds')) $('#countSeconds').textContent = String(seconds).padStart(2, '0');
  };

  updateTimer();
  const intervalId = setInterval(updateTimer, 1000);
}

// ───────────────────────────────────────────
//  5. 혼주 정보 구조 주입
// ───────────────────────────────────────────
function initGreetingParents() {
  const container = $('#greetingParents');
  const cfg = window.CONFIG || CONFIG;
  if (!container || !cfg) return;

  const makeRow = (parent, name, title) => {
    if (!parent) return '';
    const fStr = parent.father ? (parent.fatherDeceased ? `故 ${parent.father}` : parent.father) : '';
    const mStr = parent.mother ? (parent.motherDeceased ? `故 ${parent.mother}` : parent.mother) : '';
    const parentName = (fStr && mStr) ? `${fStr} · ${mStr}` : (fStr || mStr);
    
    return `
      <div class="parent-row">
        <span>${parentName}</span>
        <span class="parent-dot">의</span>
        <span>${title}</span>
        <span class="child-name">${name}</span>
      </div>
    `;
  };

  container.innerHTML = makeRow(cfg.groom, cfg.groom ? cfg.groom.name : "", '장남') + 
                        makeRow(cfg.bride, cfg.bride ? cfg.bride.name : "", '장녀');
}

// ───────────────────────────────────────────
//  6. 갤러리 이미지 자동 감지 순회 및 모달 라이트박스
// ───────────────────────────────────────────
function initPhotoModal() {
  const modal = $('#photoModal');
  const grid = $('#galleryGrid');
  const modalImg = $('#modalImg');
  const closeBtn = $('#modalClose');
  const prevBtn = $('#modalPrev');
  const nextBtn = $('#modalNext');
  const counter = $('#modalCounter');

  if (!modal || !grid) return;

  const maxSearchCount = 12; 
  let validImages = [];
  let htmlBuffer = "";

  for (let i = 1; i <= maxSearchCount; i++) {
    const imgSrc = `images/gallery/${i}.jpg`;
    validImages.push(imgSrc);
    htmlBuffer += `
      <div class="gallery__item" data-index="${i - 1}">
        <img src="${imgSrc}" alt="갤러리 사진" onerror="this.parentNode.style.display='none';">
      </div>
    `;
  }
  grid.innerHTML = htmlBuffer;

  let currentIndex = 0;

  setTimeout(() => {
    const activeItems = Array.from($$('.gallery__item')).filter(el => el.style.display !== 'none');
    validImages = activeItems.map(el => el.querySelector('img').src);
    activeItems.forEach((el, idx) => {
      el.setAttribute('data-index', idx);
    });
  }, 400);

  const updateModalImage = (index) => {
    if (validImages.length === 0) return;
    currentIndex = (index + validImages.length) % validImages.length;
    if (modalImg) modalImg.src = validImages[currentIndex];
    if (counter) counter.textContent = `${currentIndex + 1} / ${validImages.length}`;
  };

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery__item');
    if (!item || item.style.display === 'none') return;

    const idx = parseInt(item.getAttribute('data-index'), 10);
    updateModalImage(idx);
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
  });

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === $('#modalContainer')) closeModal();
  });

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); updateModalImage(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); updateModalImage(currentIndex + 1); });
}

// ───────────────────────────────────────────
//  7. 축의금 목록 바인딩 및 아코디언 확장
// ───────────────────────────────────────────
function initAccounts() {
  const cfg = window.CONFIG || CONFIG;
  if (!cfg || !cfg.accounts) return;

  const renderSide = (targetId, list) => {
    const container = $(`#${targetId}`);
    if (!container || !list) return;

    container.innerHTML = list.map(acc => `
      <div class="account-item">
        <div class="account-item__info">
          <div class="account-item__role">${acc.role}</div>
          <div class="account-item__detail">
            <span class="account-item__bank">${acc.bank}</span> 
            <span class="account-item__number">${acc.number}</span>
            <span class="account-item__name">${acc.name}</span>
          </div>
        </div>
        <button type="button" class="account-item__copy" data-account="${acc.number}">복사</button>
      </div>
    `).join('');
  };

  renderSide('groomAccountList', cfg.accounts.groom);
  renderSide('brideAccountList', cfg.accounts.bride);

  $$('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const panel = this.nextElementSibling;

      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        if (panel) panel.style.maxHeight = null;
      } else {
        this.setAttribute('aria-expanded', 'true');
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('account-item__copy')) {
      const text = e.target.getAttribute('data-account');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast('계좌번호가 복사되었습니다');
      }).catch(() => {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('계좌번호가 복사되었습니다');
      });
    }
  });
}

// ───────────────────────────────────────────
//  8. 식장 주소 전체 복사 기능
// ───────────────────────────────────────────
function initLocationCopy() {
  const btn = $('#copyAddressBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const cfg = window.CONFIG || CONFIG;
    const addr = (cfg && cfg.wedding) ? cfg.wedding.address : '';
    navigator.clipboard.writeText(addr).then(() => {
      showToast('주소가 복사되었습니다');
    });
  });
}

// ───────────────────────────────────────────
//  9. 스크롤 인터랙션 페이드인
// ───────────────────────────────────────────
function initScrollAnimations() {
  const animateItems = $$('.animate-item');
  if (animateItems.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animateItems.forEach(item => observer.observe(item));
}

// ───────────────────────────────────────────
//  안전 주입 실행 시퀀스 (루프 에러 방지)
// ───────────────────────────────────────────
function mainLauncher() {
  initConfigData();       
  initCurtain();          
  initBGM();              
  initCountdown();        
  initGreetingParents();  
  initPhotoModal();       
  initAccounts(); // 👈 누락 가능성 있었던 계좌 초기화 바인딩 강제 재호출
  initLocationCopy();     
  initScrollAnimations();  
}

// DOM 가동 및 로드 상태에 따른 완벽한 방어 코드
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mainLauncher);
} else {
  mainLauncher();
}
