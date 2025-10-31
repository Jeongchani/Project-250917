# TodoBarApp [ Project-250917 ]

Electron + React + Vite 기반의 심플한 할 일 관리 바 애플리케이션

------------------------------------------------------------------------

## 📦 프로젝트 구조

    todo-bar-app/
     ├─ build/                # 아이콘 등 빌드 리소스
     ├─ frontend/             # React + Vite 프론트엔드
     ├─ main.js               # Electron 메인 프로세스
     ├─ preload.js            # 브라우저-노드 브릿지
     ├─ package.json          # 전체 빌드 스크립트
     └─ .gitignore

------------------------------------------------------------------------

## 🚀 실행 방법

### 1. 의존성 설치

``` bash
npm install
```

### 2. 개발 모드 실행

``` bash
npm run dev
```

-   `frontend`는 Vite 개발 서버(`http://localhost:5173`) 실행
-   `electron`은 개발 서버 준비 후 자동 실행

### 3. 빌드

``` bash
npm run build
```

-   `frontend/dist` 생성 후 Electron 패키징
-   Windows: `dist/win-unpacked/` 또는 `dist/TodoBarApp Setup.exe` 출력

### 4. 릴리스 (GitHub 배포)

``` bash
npm run release
```

-   GitHub Releases에 자동 업로드 (`electron-builder --publish always`)

------------------------------------------------------------------------

## 📜 주요 스크립트

-   `dev:renderer` → 프론트엔드 개발 서버 실행
-   `dev:electron` → Electron 개발 실행
-   `dev` → 둘 다 동시에 실행
-   `build:renderer` → 프론트엔드 빌드
-   `build:electron` → Electron 빌드
-   `clean` → dist 폴더 정리
-   `build` → 전체 빌드
-   `release` → 릴리스 빌드 + GitHub 업로드

------------------------------------------------------------------------

## ⚙️ 환경변수

-   `ELECTRON_DEV=true` → 개발 모드에서 Vite 서버 로드\
-   배포 모드에서는 `frontend/dist/index.html` 로드

------------------------------------------------------------------------

## 🛠️ 기술 스택

-   **Electron** - 데스크탑 앱 프레임워크
-   **React + Vite** - 프론트엔드
-   **TypeScript**
-   **electron-builder** - 배포 및 패키징
-   **electron-store** - 로컬 데이터 저장

------------------------------------------------------------------------

## 📂 빌드 산출물

-   `dist/` : Electron 빌드 결과물
-   `frontend/dist/` : Vite 빌드 결과물

------------------------------------------------------------------------

## 📝 라이선스

MIT License

------------------------------------------------------------------------

## 버전 업데이트

# 최신 반영
git pull

# 패치 버전 올리기 (예: 1.0.3)
npm version patch -m "chore: release %s"

# 태그/커밋 푸시
git push && git push --tags