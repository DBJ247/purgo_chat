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

=======
# 💬 Purgo Chat - 실시간 채팅 및 욕설 필터링 시스템

Purgo Chat은 WebSocket을 이용한 실시간 채팅 시스템으로, 욕설이 포함된 메시지를 FastAPI를 통해 필터링하고, JPA 기반으로 채팅 내용 및 사용자 상태를 관리합니다.

---

## 📦 프로젝트 디렉토리 구조

```
main/
├── resources/
│   ├── application.properties              # Spring Boot 설정 파일
│   └── static/
│       └── index.html                      # 정적 웹 파일
└── java/org/example/purgo_chat/
    ├── PurgoChatApplication.java           # 메인 실행 클래스
    ├── controller/                         # WebSocket 컨트롤러
    ├── service/                            # 비즈니스 로직 (채팅, 필터링 등)
    ├── handler/                            # WebSocket 핸들러
    ├── config/                             # 설정 클래스 (WebSocket, RestTemplate)
    ├── dto/                                # 데이터 전송 객체 (DTO)
    ├── entity/                             # JPA 엔티티 (DB 매핑 클래스)
    └── repository/                         # Spring Data JPA 레포지토리
```

---

## 📁 주요 디렉토리 설명

- `controller/` : WebSocket 메시지의 진입점 (ENTER, TALK, LEAVE 처리)
- `service/` : ChatService, BadwordFilterService 등 핵심 로직 담당
- `handler/` : WebSocket 메시지의 구체적인 분기 처리
- `config/` : WebSocket 설정 및 외부 API 호출을 위한 RestTemplate 설정
- `dto/` : 클라이언트와 주고받는 JSON 구조 정의
- `entity/` : JPA 기반 테이블 매핑 (ChatRoom, Message)
- `repository/` : Spring Data JPA를 활용한 DB 접근 레이어

---

## 🔁 전체 흐름 구조

1. 클라이언트가 WebSocket을 통해 접속
2. 메시지 타입에 따라 분기 처리:
   - `ENTER`: 사용자 닉네임 등록
   - `TALK`: 메시지를 FastAPI에 전달하여 욕설 여부 분석 → 저장 및 전송
   - `LEAVE`: 사용자 퇴장 처리
3. DB에는 채팅방(ChatRoom)과 메시지(Message)가 저장됨

```plaintext
[Client] ─▶ WebSocket 연결
   │
   ├─▶ ENTER → [ChatService] 사용자 등록
   ├─▶ TALK  → [BadwordFilterService] 욕설 분석
   │           └─▶ [ChatService] 메시지 저장 + 브로드캐스트
   └─▶ LEAVE → [ChatService] 퇴장 처리
```

---

## ⚙️ 욕설 필터링 방식

- `BadwordFilterService`는 FastAPI 서버에 메시지를 POST 요청으로 전달
- FastAPI 응답 구조 예시:
```json
{
  "isAbusive": true,
  "originalText": "욕설 포함된 문장",
  "rewrittenText": "***"
}
```
- 욕설이 감지되면 `chatService.incrementBadwordCount()` 실행
- FastAPI 장애 시 원문 그대로 반환

---

## 🗃️ 데이터베이스 구조 및 설명 (MySQL 기준)

### 📁 ChatRoom 테이블  
채팅방의 정보를 저장합니다. 사용자 닉네임, 욕설 수, 퇴장 수 등을 관리합니다.

```sql
CREATE TABLE ChatRoom (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_name VARCHAR(255) NULL,
    user2_name VARCHAR(255) NULL,
    badword_count INT DEFAULT 0,
    leave_count INT DEFAULT 0
);
```

### 📁 Message 테이블  
각 메시지 기록을 저장합니다. 채팅방 ID를 외래키로 연결하며, 송수신자 및 생성 시간을 포함합니다.

```sql
CREATE TABLE Message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chatroom_id INT NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatroom_id) REFERENCES ChatRoom(id)
);
```

---

## 🧩 핵심 기능 요약

- ✅ 실시간 채팅 (WebSocket)
- ✅ 욕설 필터링 (FastAPI 연동)
- ✅ 채팅방 입퇴장 추적
- ✅ JPA를 통한 DB 자동 매핑 및 저장

---

## 🛠️ 향후 개선 아이디어

- 사용자 인증(JWT 기반)
- 채팅방 다중화
- 욕설 자동 필터 수준 조정
- 관리자 모니터링 기능
