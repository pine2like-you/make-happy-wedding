/**
 * ═══════════════════════════════════════════
 * Nature Green Wedding Invitation
 * Korean Mobile 청첩장 - 완벽 호환 Scripts (2026)
 * ═══════════════════════════════════════════
 */

// DOM 선택을 위한 헬퍼 함수
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ───────────────────────────────────────────
//  공통 유틸리티: 토스트 알림 (Toast Notification)
// ───────────────────────────────────────────
function showToast(message) {
  let toast = $('#toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('is-visible');

  // 2.5초 후 토스트 알림 숨기기
  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2500);
}

// ───────────────────────────────────────────
//  1. 커튼 열기 애니메이션 (Curtain Opening)
// ───────────────────────────────────────────
function initCurtain() {
  const curtain = $('#curtain');
  const curtainBtn = $('#curtainBtn');
  const bgm = document.getElementById('bgm');
  const btn = $('#bgmBtn');

  if (!curtain) return;

  // 초기 커튼 이름 설정 (config 데이터 활용 예시)
  const curtainNames = $('#curtainNames');
  if (curtainNames && window.weddingConfig) {
    curtainNames.textContent = `${window.weddingConfig.groom.name} & ${window.weddingConfig.bride.name}`;
  }

  // 브라우저 스크롤 방지 (커튼이 닫혀있을 때)
  document.body.classList.add('no-scroll');

  const openCurtain = () => {
    curtain.classList.add('is-open');
    document.body.classList.remove('no-scroll');

    // 커튼을 열 때 음악 자동 재생 시도 (모바일 정책 우회)
    if (bgm && btn) {
      bgm.play().then(() => {
        btn.classList.add('is-playing');
        if (btn.querySelector('.icon-mute')) btn.querySelector('.icon-mute').style.display = 'none';
        if (btn.querySelector('.icon-sound')) btn.querySelector('.icon-sound').style.display = 'block';
        showToast('배경음악이 재생됩니다');
      }).catch((err) => {
        console.log('자동 재생 제한: 사용자가 음악 버튼을 직접 눌러야 합니다.', err);
      });
    }

    // 애니메이션 종료 후 완전히 숨김 처리
    setTimeout(() => {
      curtain.classList.add('is-hidden');
    }, 1200);
  };

  if (curtainBtn) {
    curtainBtn.addEventListener('click', openCurtain);
  }
}

// ───────────────────────────────────────────
//  2. 배경음악 제어 (Background Music)
// ───────────────────────────────────────────
function initBGM() {
  const bgm = document.getElementById('bgm');
  const btn = $('#bgmBtn');

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
//  3. 디데이 카운트다운 (D-Day Countdown)
// ───────────────────────────────────────────
function initCountdown() {
  const countdown = $('#countdown');
  if (!countdown) return;

  // config.js 에 설정된 날짜가 있다면 가져오고, 없으면 기본값 설정
  const targetDateStr = (window.weddingConfig && window.weddingConfig.weddingDate) 
                        ? window.weddingConfig.weddingDate 
                        : '2026-10-24T12:00:00+09:00';
  const weddingDate = new Date(targetDateStr).getTime();

  // 레이블 이름 동적 매칭
  const label = $('#countdownLabel');
  if (label && window.weddingConfig) {
    label.textContent = `${window.weddingConfig.groom.name} ♥ ${window.weddingConfig.bride.name}의 결혼식이`;
  }

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const countDays = $('#countDays');
    const countHours = $('#countHours');
    const countMinutes = $('#countMinutes');
    const countSeconds = $('#countSeconds');

    if (distance < 0) {
      if (countdown) countdown.innerHTML = '<p class="countdown__label">축하해 주셔서 대단히 감사합니다.</p>';
      clearInterval(intervalId);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (countDays) countDays.textContent = String(days);
    if (countHours) countHours.textContent = String(hours).padStart(2, '0');
    if (countMinutes) countMinutes.textContent = String(minutes).padStart(2, '0');
    if (countSeconds) countSeconds.textContent = String(seconds).padStart(2, '0');
  };

  updateTimer();
  const intervalId = setInterval(updateTimer, 1000);
}

// ───────────────────────────────────────────
//  4. 메타 데이터 및 텍스트 바인딩 (Config Data)
// ───────────────────────────────────────────
function initConfigData() {
  const cfg = window.weddingConfig;
  if (!cfg) return;

  // 메타 태그 주입
  if ($('meta[property="og:title"]')) $('meta[property="og:title"]').setAttribute('content', `${cfg.groom.name} & ${cfg.bride.name} 모바일 초대장`);
  if ($('meta[property="og:description"]')) $('meta[property="og:description"]').setAttribute('content', `${cfg.location.venue} ${cfg.location.hall}`);

  // 영웅 영역(Hero) 텍스트 주입
  if ($('#heroPhoto')) $('#heroPhoto').src = cfg.heroImageUrl || "images/hero.jpg";
  if ($('#heroNames')) $('#heroNames').innerHTML = `${cfg.groom.name}<br>&<br>${cfg.bride.name}`;
  if ($('#heroDate')) $('#heroDate').textContent = cfg.weddingDateFormatted || "";
  if ($('#heroVenue')) $('#heroVenue').textContent = `${cfg.location.venue} ${cfg.location.hall}`;

  // 인사말 영역 주입
  if ($('#greetingTitle')) $('#greetingTitle').textContent = cfg.greeting.title || "초대합니다";
  if ($('#greetingContent')) $('#greetingContent').textContent = cfg.greeting.content || "";

  // 오시는 길 주입
  if ($('#locationVenue')) $('#locationVenue').textContent = cfg.location.venue;
  if ($('#locationHall')) $('#locationHall').textContent = cfg.location.hall;
  if ($('#locationAddress')) $('#locationAddress').textContent = cfg.location.address;
  if ($('#locationTel')) $('#locationTel').textContent = cfg.location.phone ? `Tel. ${cfg.location.phone}` : "";
  if ($('#locationMapImg')) $('#locationMapImg').src = cfg.location.mapImageUrl || "images/map.jpg";

  // 지도 링크 주입
  if ($('#kakaoMapBtn') && cfg.location.kakaoMapUrl) $('#kakaoMapBtn').href = cfg.location.kakaoMapUrl;
  if ($('#naverMapBtn') && cfg.location.naverMapUrl) $('#naverMapBtn').href = cfg.location.naverMapUrl;

  // 푸터 주입
  if ($('#footerText')) $('#footerText').textContent = `Copyright © ${cfg.groom.name} & ${cfg.bride.name}. All Rights Reserved.`;
}

// ───────────────────────────────────────────
//  5. 사진 갤러리 모달 (Photo Modal)
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

  const cfg = window.weddingConfig;
  const images = (cfg && cfg.galleryImages) ? cfg.galleryImages : [];

  if (images.length === 0) return;

  // 갤러리 그리드 동적 생성
  grid.innerHTML = images.map((src, idx) => `
    <div class="gallery__item" data-index="${idx}">
      <img src="${src}" alt="갤러리 사진 ${idx + 1}" loading="lazy">
    </div>
  `).join('');

  let currentIndex = 0;

  const updateModalImage = (index) => {
    currentIndex = index;
    if (modalImg) modalImg.src = images[currentIndex];
    if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
  };

  // 이미지 클릭 시 오픈 이벤트 전파 위임
  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery__item');
    if (!item) return;

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
    if (e.target === modal || e.target === $('#modalContainer')) {
      closeModal();
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalImage((currentIndex - 1 + images.length) % images.length);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalImage((currentIndex + 1) % images.length);
    });
  }
}

// ───────────────────────────────────────────
//  6. 축의금 아코디언 및 목록 데이터 바인딩
// ───────────────────────────────────────────
function initAccounts() {
  const cfg = window.weddingConfig;
  if (!cfg) return;

  const renderAccountList = (targetId, accountData) => {
    const container = $(`#${targetId}`);
    if (!container || !accountData) return;

    container.innerHTML = accountData.map(acc => `
      <div class="account-item">
        <div class="account-item__info">
          <div class="account-item__role">${acc.relation}</div>
          <div class="account-item__detail">
            <span class="account-item__bank">${acc.bank}</span> 
            <span class="account-item__number">${acc.accountNumber}</span>
            <span class="account-item__name">${acc.holder}</span>
          </div>
        </div>
        <button type="button" class="account-item__copy" data-account="${acc.accountNumber}">복사</button>
      </div>
    `).join('');
  };

  renderAccountList('groomAccountList', cfg.groom.accounts);
  renderAccountList('brideAccountList', cfg.bride.accounts);

  // 아코디언 펼치기/접기 제어 토글
  const triggers = $$('.accordion__trigger');
  triggers.forEach(trigger => {
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

  // 복사 버튼 기능 위임 연동
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
//  7. 주소 복사 (Address Copy)
// ───────────────────────────────────────────
function initLocationCopy() {
  const btn = $('#copyAddressBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const addr = window.weddingConfig ? window.weddingConfig.location.address : '주소 정보 없음';
    navigator.clipboard.writeText(addr).then(() => {
      showToast('주소가 복사되었습니다');
    });
  });
}

// ───────────────────────────────────────────
//  8. 스크롤 애니메이션 감지 (Scroll Animations)
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

// 🧩 부모 정보 렌더링 예외 처리 (미구현 방지 보완)
function initGreetingParents() {
  const container = $('#greetingParents');
  const cfg = window.weddingConfig;
  if (!container || !cfg) return;

  const renderRow = (side, parentData, childName, title) => `
    <div class="parent-row">
      <span>${parentData.father || ''}${parentData.mother ? ' · ' + parentData.mother : ''}</span>
      <span class="parent-dot">의</span>
      <span>${title}</span>
      <span class="child-name">${childName}</span>
    </div>
  `;

  let html = '';
  if (cfg.groom) html += renderRow('groom', cfg.groom, cfg.groom.name, '장남');
  if (cfg.bride) html += renderRow('bride', cfg.bride, cfg.bride.name, '장녀');
  container.innerHTML = html;
}

// 🧩 미사용 컴포넌트 목업 스터브 처리 (에러 원천 차단)
function showLoadingPlaceholders() {}
function initCalendar() {}

// ───────────────────────────────────────────
//  전체 시스템 순차적 초기화 실행 루프 (Execution)
// ───────────────────────────────────────────
function init() {
  initConfigData();      // 1. 설정 데이터 연동
  initCurtain();         // 2. 오프닝 커튼 작동
  initBGM();             // 3. 사운드 제어 작동
  initCountdown();       // 4. 디데이 시계 작동
  initGreetingParents(); // 5. 혼주 정보 구성
  initPhotoModal();      // 6. 갤러리 및 모달 팝업 세팅
  initLocationCopy();    // 7. 주소 복사 기능 작동
  initScrollAnimations(); // 8. 스크롤 페이드인 효과 구동
  
  console.log('Mobile Invitation Script stabilized.');
}

// DOM 생성이 안전하게 마무리되면 스위치 켜기
document.addEventListener('DOMContentLoaded', init);
