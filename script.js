/**
 * ═══════════════════════════════════════════
 * Nature Green Wedding Invitation
 * CONFIG 데이터 구조 100% 맞춤형 스크립트 (2026)
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
//  1. CONFIG 데이터 텍스트 및 이미지 매칭 (날짜/사진 복구)
// ───────────────────────────────────────────
function initConfigData() {
  const cfg = window.CONFIG;
  if (!cfg) {
    console.error("config.js 파일의 CONFIG 데이터를 찾을 수 없습니다.");
    return;
  }

  // [메타 태그 주입]
  if ($('meta[property="og:title"]')) $('meta[property="og:title"]').setAttribute('content', cfg.meta.title);
  if ($('meta[property="og:description"]')) $('meta[property="og:description"]').setAttribute('content', cfg.meta.description);
  if ($('meta[property="og:image"]')) $('meta[property="og:image"]').setAttribute('content', 'images/og/1.jpg');
  if ($('meta[name="description"]')) $('meta[name="description"]').setAttribute('content', cfg.meta.description);

  // [커튼 오프닝 이름]
  if ($('#curtainNames')) {
    $('#curtainNames').textContent = `${cfg.groom.name} & ${cfg.bride.name}`;
  }

  // [히어로(메인) 영역] - 규칙에 따른 고정 폴더 이미지 주입
  if ($('#heroPhoto')) $('#heroPhoto').src = "images/hero/1.jpg";
  if ($('#heroNames')) $('#heroNames').innerHTML = `${cfg.groom.name}<br>&<br>${cfg.bride.name}`;
  
  // 날짜 가독성 변환 (2026-08-22 -> 2026년 8월 22일)
  const dateParts = cfg.wedding.date.split('-');
  if (dateParts.length === 3 && $('#heroDate')) {
    $('#heroDate').textContent = `${dateParts[0]}년 ${parseInt(dateParts[1])}월 ${parseInt(dateParts[2])}일 ${cfg.wedding.time}`;
  }

  if ($('#heroVenue')) $('#heroVenue').textContent = `${cfg.wedding.venue} ${cfg.wedding.hall}`;

  // [인사말 영역]
  if ($('#greetingTitle')) $('#greetingTitle').textContent = cfg.greeting.title;
  if ($('#greetingContent')) $('#greetingContent').textContent = cfg.greeting.content;

  // [오시는 길 영역]
  if ($('#locationVenue')) $('#locationVenue').textContent = cfg.wedding.venue;
  if ($('#locationHall')) $('#locationHall').textContent = cfg.wedding.hall;
  if ($('#locationAddress')) $('#locationAddress').textContent = cfg.wedding.address;
  if ($('#locationTel')) $('#locationTel').textContent = `Tel. ${cfg.wedding.tel}`;
  if ($('#locationMapImg')) $('#locationMapImg').src = "images/location/1.jpg";

  // 지도 앱 연결 링크
  if ($('#kakaoMapBtn')) $('#kakaoMapBtn').href = cfg.wedding.mapLinks.kakao;
  if ($('#naverMapBtn')) $('#naverMapBtn').href = cfg.wedding.mapLinks.naver;

  // [푸터]
  if ($('#footerText')) $('#footerText').textContent = `Copyright © ${cfg.groom.name} & ${cfg.bride.name}. All Rights Reserved.`;
}

// ───────────────────────────────────────────
//  2. 커튼 오프닝 제어 & BGM 연동
// ───────────────────────────────────────────
function initCurtain() {
  const curtain = $('#curtain');
  const curtainBtn = $('#curtainBtn');
  const bgm = document.getElementById('bgm');
  const btn = $('#bgmBtn');
  const cfg = window.CONFIG;

  if (!curtain) return;

  // CONFIG에서 안 쓰겠다고 설정한 경우 바로 스킵
  if (cfg && cfg.useCurtain === false) {
    curtain.style.display = 'none';
    document.body.classList.remove('no-scroll');
    return;
  }

  document.body.classList.add('no-scroll');

  const openCurtain = () => {
    curtain.classList.add('is-open');
    document.body.classList.remove('no-scroll');

    // 모바일 BGM 재생 트리거 연동
    if (bgm && btn) {
      bgm.play().then(() => {
        btn.classList.add('is-playing');
        if (btn.querySelector('.icon-mute')) btn.querySelector('.icon-mute').style.display = 'none';
        if (btn.querySelector('.icon-sound')) btn.querySelector('.icon-sound').style.display = 'block';
        showToast('배경음악이 재생됩니다');
      }).catch((err) => {
        console.log('BGM 자동 재생 차단: 유저가 버튼 직접 클릭 필요.', err);
      });
    }

    setTimeout(() => { curtain.classList.add('is-hidden'); }, 1200);
  };

  if (curtainBtn) curtainBtn.addEventListener('click', openCurtain);
}

// ───────────────────────────────────────────
//  3. 배경음악 버튼 작동 제어
// ───────────────────────────────────────────
function initBGM() {
  const bgm = document.getElementById('bgm');
  const btn = $('#bgmBtn');

  if (!bgm || !btn) return;

  const iconMute = btn.querySelector('.icon-mute');
