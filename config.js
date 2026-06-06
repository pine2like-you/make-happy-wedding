/**
 * Nature Green Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: true,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "전준석",
    nameEn: "Groom",
    father: "전종복",
    mother: "박귀숙",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "한솔",
    nameEn: "Bride",
    father: "한현수",
    mother: "이숙",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-08-22",
    time: "15:00",
    venue: "누에바파밀리아",
    hall: "파밀리아홀",
    address: "경기 용인시 수지구 신봉1로 344번길 1",
    tel: "031-266-7772",
    mapLinks: {
      kakao: "https://place.map.kakao.com/1190936092",
      naver: "https://naver.me/FeXR23xO"
    }
  },

  // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "겨울에 태어난 두 사람은\n가장 찬란한 여름날,\n서로의 따듯한 계절이 되어주기로 했습니다.\n\n사랑과 웃음이 가득할 그 날,\n소중한 걸음으로 함께하시어\n저희의 시작을 축복해 주시면 감사하겠습니다."
  },



  // ── 오시는 길 ──
  // (mapLinks와 캘린더는 location 섹션 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "전준석", bank: "신한은행", number: "110-273-748225" },
      { role: "아버지", name: "전종복", bank: "신한은행", number: "110-029-686429" },
      { role: "어머니", name: "박귀숙", bank: "신한은행", number: "110-029-686429" }
    ],
    bride: [
      { role: "신부", name: "한솔", bank: "농협은행", number: "302-1786-1820-21" },
      { role: "아버지", name: "한현수", bank: "농협은행", number: "1031-2472-523" },
      { role: "어머니", name: "이숙", bank: "농협은행", number: "000-000-000000" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "신랑 ♥ 신부 결혼합니다",
    description: "2026년 8월 22일, 소중한 분들을 초대합니다."
  }
};
