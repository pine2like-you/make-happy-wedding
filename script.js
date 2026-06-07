/**
 * ═══════════════════════════════════════════
 * Nature Green Wedding Invitation
 * Korean Mobile 청첩장 - Scripts (2026)
 * ═══════════════════════════════════════════
 */

// 간편한 DOM 선택을 위한 헬퍼 함수
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ───────────────────────────────────────────
//  공통 유틸리티: 토스트 알림 (Toast Notification)
// ───────────────────────────────────────────
function showToast(message) {
  let toast = $('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
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
  const curtain = $('.curtain');
  const curtainBtn = $('.curtain__btn');
  const bgm = document.getElementById('bgm');
  const musicBtn = $('.music-btn');

  if (!curtain) return;

  // 브라우저 스크롤 방지 (커튼이 닫혀있을 때)
  document.body.classList.add('no-scroll');

  const openCurtain = () => {
    curtain.classList.add('is-open');
    document.body.classList.remove('no-scroll');

    // 모바일 자동재생 제한을 우회하기 위해 커튼을 열 때 음악 시작 정책 적용
    if (bgm && musicBtn) {
      bgm.play().then(() => {
        musicBtn.innerHTML = '🎵'; // 재생 중 아이콘
        showToast('배경음악이 재생됩니다.');
      }).catch((err) => {
        console.log('자동 재생 차단됨: 사용자의 직접 클릭 필요', err);
        musicBtn.innerHTML = '🔇'; // 정지 상태 아이콘
      });
    }

    // 애니메이션이 완전히 끝난 후 DOM에서 제거하여 메모리 확보
    setTimeout(() => {
      curtain.classList.add('is-hidden');
    }, 1200);
  };

  if (curtainBtn) {
    curtainBtn.addEventListener('click', openCurtain);
  } else {
    // 버튼이 없을 경우 화면 어디를 눌러도 열리도록 예외 처리
    curtain.addEventListener('click', openCurtain);
  }
}

// ───────────────────────────────────────────
//  2. 배경음악 제어 (Background Music)
// ───────────────────────────────────────────
function initBGM() {
  const bgm = document.getElementById('bgm');
  const btn = $('.music-btn');

  if (!bgm || !btn) return;

  btn.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play().then(() => {
        btn.innerHTML = '🎵'; // 재생 상태 아이콘
        showToast('배경음악이 재생됩니다.');
      }).catch(() => {
        showToast('음악을 재생할 수 없습니다.');
      });
    } else {
      bgm.pause();
      btn.innerHTML = '🔇'; // 정지 상태 아이콘
      showToast('배경음악이 일시정지되었습니다.');
    }
  });
}

// ───────────────────────────────────────────
//  3. 디데이 카운트다운 (D-Day Countdown)
// ───────────────────────────────────────────
function initCountdown() {
  const timer = $('.countdown__timer');
  if (!timer) return;

  // 예시 타겟 날짜 (※ 실제 예식일에 맞게 기입 필요)
  // config.js가 있다면 'config.weddingDate' 형식으로 대체 가능합니다.
  const weddingDate = new Date('2026-10-24T12:00:00+09:00').getTime();

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      timer.innerHTML = '<div class="countdown__end">축하해주셔서 감사합니다.</div>';
      clearInterval(intervalId);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dNum = $('#days-num');
    const hNum = $('#hours-num');
    const mNum = $('#minutes-num');
    const sNum = $('#seconds-num');

    if (dNum) dNum.textContent = String(days).padStart(2, '0');
    if (hNum) hNum.textContent = String(hours).padStart(2, '0');
    if (mNum) mNum.textContent = String(minutes).padStart(2, '0');
    if (sNum) sNum.textContent = String(seconds).padStart(2, '0');
  };

  updateTimer();
  const intervalId = setInterval(updateTimer, 1000);
}

// ───────────────────────────────────────────
//  4. 사진 갤러리 모달 (Photo Modal)
// ───────────────────────────────────────────
function initPhotoModal() {
  const modal = $('.photo-modal');
  const gridItems = $$('.gallery__item');
  const modalImg = $('.photo-modal__img');
  const closeBtn = $('.photo-modal__close');
  const prevBtn = $('.photo-modal__nav--prev');
  const nextBtn = $('.photo-modal__nav--next');
  const counter = $('.photo-modal__counter');

  if (!modal || gridItems.length === 0) return;

  let currentIndex = 0;
  const images = Array.from(gridItems).map(item => item.querySelector('img').src);

  const updateModalImage = (index) => {
    currentIndex = index;
    if (modalImg) modalImg.src = images[currentIndex];
    if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
  };

  // 이미지 클릭 시 모달 열기
  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateModalImage(index);
      modal.classList.add('is-open');
      document.body.classList.add('no-scroll');
    });
  });

  // 닫기 기능
  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === $('.photo-modal__container')) {
      closeModal();
    }
  });

  // 이전/다음 버튼 제어
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextIdx = (currentIndex - 1 + images.length) % images.length;
      updateModalImage(nextIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextIdx = (currentIndex + 1) % images.length;
      updateModalImage(nextIdx);
    });
  }

  // 모바일 스와이프(터치) 기능 지원
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    
    if (swipeDistance > 50) { // 오른쪽 스와이프 -> 이전 이미지
      const nextIdx = (currentIndex - 1 + images.length) % images.length;
      updateModalImage(nextIdx);
    } else if (swipeDistance < -50) { // 왼쪽 스와이프 -> 다음 이미지
      const nextIdx = (currentIndex + 1) % images.length;
      updateModalImage(nextIdx);
    }
  }, { passive: true });
}

// ───────────────────────────────────────────
//  5. 축의금 아코디언 (Account Accordion)
// ───────────────────────────────────────────
function initAccounts() {
  const triggers = $$('.accordion__trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const panel = this.nextElementSibling;

      // 이미 열려있던 것 닫기 (동작을 하나씩만 열리게 제어하고 싶을 때)
      triggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherTrigger.nextElementSibling) {
            otherTrigger.nextElementSibling.style.maxHeight = null;
          }
        }
      });

      // 토글 작동
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        if (panel) panel.style.maxHeight = null;
      } else {
        this.setAttribute('aria-expanded', 'true');
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // 계좌번호 복사하기 기능 연동
  const copyButtons = $$('.account-item__copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // 아코디언이 함께 닫히는 현상 방지
      const accountText = this.getAttribute('data-account');
      
      if (!accountText) return;

      navigator.clipboard.writeText(accountText).then(() => {
        showToast('계좌번호가 복사되었습니다.');
      }).catch(() => {
        // 구형 브라우저 대체용
        const tempInput = document.createElement('input');
        tempInput.value = accountText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('계좌번호가 복사되었습니다.');
      });
    });
  });
}

// ───────────────────────────────────────────
//  6. 스크롤 애니메이션 감지 (Scroll Animations)
// ───────────────────────────────────────────
function initScrollAnimations() {
  const animateItems = $$('.animate-item');
  if (animateItems.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // 요소가 15% 이상 화면에 보일 때 작동
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 한 번 등장하면 감지 해제
      }
    });
  }, observerOptions);

  animateItems.forEach(item => observer.observe(item));
}

// ───────────────────────────────────────────
//  7. 주소 복사 (Address Copy)
// ───────────────────────────────────────────
function initLocation() {
  const addressBtn = $('.location__copy-btn');
  if (!addressBtn) return;

  addressBtn.addEventListener('click', function() {
    const addressText = this.getAttribute('data-address') || "서울시 예식장 주소 텍스트";
    navigator.clipboard.writeText(addressText).then(() => {
      showToast('주소가 복사되었습니다.');
    });
  });
}

// ───────────────────────────────────────────
//  전체 시스템 초기화 실행 루프 (Execution)
// ───────────────────────────────────────────
async function init() {
  // 1. 커튼 초기화 (최우선 순위)
  initCurtain();
  
  // 2. 사운드 시스템 초기화
  initBGM();
  
  // 3. 컨텐츠 하위 컴포넌트 구동
  initCountdown();
  initPhotoModal();
  initLocation();
  initAccounts();
  initScrollAnimations();
  
  console.log('Mobile Invitation Script initialized successfully.');
}

// DOM 생성이 완료되면 실행 스위치 켜기
document.addEventListener('DOMContentLoaded', init);
