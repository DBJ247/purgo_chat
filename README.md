# 💻 React 프론트엔드 구조 설명

## 📁 디렉토리 구조 및 컴포넌트 역할

```
src/
├── App.js                 # 애플리케이션 루트 컴포넌트, 라우팅 설정
├── App.css                # 전체 애플리케이션 공통 스타일
├── App.test.js            # 테스트용 파일
├── index.js               # ReactDOM을 통해 App을 브라우저에 렌더링
├── index.css              # 기본 전역 CSS 스타일
├── logo.svg               # 기본 제공된 로고
├── reportWebVitals.js     # 성능 측정 도구 (옵션)
├── setupTests.js          # 테스트 환경 초기 설정
│
├── context/
│   └── NicknameContext.js # Context API로 전역 닉네임 상태 관리
│
├── components/
│   └── NicknameForm.js    # 닉네임 입력 폼 컴포넌트
│
└── pages/
    ├── ChatRoomPage.js    # 채팅방 페이지, WebSocket 연결 및 메시지 송수신
    └── NicknamePage.js    # 닉네임을 설정하는 초기 진입 페이지
```

---

## 🧩 주요 컴포넌트 역할

- **`App.js`**
  - `react-router-dom`을 통해 페이지 라우팅 구성
  - 닉네임 설정 페이지(`/`)와 채팅방 페이지(`/chat`)로 연결

- **`NicknamePage.js`**
  - 닉네임 입력 UI 제공
  - 입력된 닉네임을 `NicknameContext`에 저장
  - `NicknameForm` 컴포넌트를 포함

- **`NicknameForm.js`**
  - 사용자 입력 폼 렌더링
  - 제출 시 `useNavigate()`를 사용해 채팅방(`/chat`)으로 이동

- **`ChatRoomPage.js`**
  - WebSocket 연결을 통해 실시간 메시지 송수신 처리
  - `NicknameContext`에서 닉네임을 불러와 사용자 식별에 사용
  - 채팅 UI 렌더링 및 메시지 상태 관리

- **`NicknameContext.js`**
  - React Context로 전역 상태 관리
  - 페이지 간 닉네임 공유 가능

---

## 🌐 라우팅 흐름

```txt
1. 사용자 접속 → "/" → NicknamePage 렌더링
2. 닉네임 입력 후 → "/chat" 으로 이동
3. ChatRoomPage 렌더링 + WebSocket 연결
4. 채팅 송수신 실시간 반영
```

라우팅 예시:
- `/` → `<NicknamePage />`
- `/chat` → `<ChatRoomPage />`

---
### 아이폰 목업 사진 안에 웹 페이지 넣기
https://velog.io/@seojin_lim/svg%ED%8C%8C%EC%9D%BC-%EB%82%B4-%EC%9B%B9-%ED%8E%98%EC%9D%B4%EC%A7%80-%EC%9E%91%EB%8F%99-%EC%84%A4%EB%AA%85%EC%84%9C

