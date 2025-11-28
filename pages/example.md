---
title: "GitHub Pages 블로그에 오신 것을 환영합니다"
date: 2025-01-26
tags: ["블로그", "GitHub Pages", "마크다운"]
category: "소개"
description: "GitHub Pages와 Vanilla JavaScript로 만든 정적 블로그입니다."
---

# 환영합니다! 👋

이 블로그는 **GitHub Pages**와 **Vanilla JavaScript**로 만들어진 정적 블로그입니다.

## 주요 기능

이 블로그는 다음과 같은 기능을 제공합니다:

- 🌓 **다크/라이트 모드** - 시스템 설정에 따라 자동 전환되며, 수동 토글도 가능합니다.
- 🔍 **검색 기능** - 제목, 내용, 태그로 게시글을 검색할 수 있습니다.
- 🏷️ **태그 필터링** - 태그를 클릭하여 관련 게시글만 볼 수 있습니다.
- 💬 **Giscus 댓글** - GitHub Discussions 기반의 댓글 시스템을 사용합니다.
- 📱 **반응형 디자인** - 모바일, 태블릿, 데스크톱 모두에서 최적화된 경험을 제공합니다.

## 코드 하이라이팅

Prism.js를 사용하여 다양한 언어의 코드를 예쁘게 표시합니다.

### JavaScript 예제

```javascript
// 간단한 함수 예제
function greet(name) {
  return `안녕하세요, ${name}님!`;
}

const message = greet('개발자');
console.log(message);
```

### Python 예제

```python
# 리스트 컴프리헨션 예제
numbers = [1, 2, 3, 4, 5]
squared = [n ** 2 for n in numbers]
print(squared)  # [1, 4, 9, 16, 25]
```

### HTML 예제

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>예제 페이지</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>
```

## 마크다운 지원

이 블로그는 GitHub Flavored Markdown(GFM)을 지원합니다.

### 텍스트 스타일

- **굵은 텍스트**
- *기울임 텍스트*
- ~~취소선~~
- `인라인 코드`

### 인용문

> "좋은 코드는 그 자체로 최고의 문서다."
> — Steve McConnell

### 체크리스트

- [x] 블로그 기본 구조 만들기
- [x] 다크 모드 구현
- [x] 검색 기능 추가
- [ ] 더 많은 게시글 작성하기

### 표

| 기능 | 상태 | 비고 |
|------|------|------|
| 마크다운 파싱 | ✅ 완료 | marked.js 사용 |
| 코드 하이라이팅 | ✅ 완료 | Prism.js 사용 |
| 댓글 시스템 | ✅ 완료 | Giscus 사용 |

## 시작하기

새 게시글을 작성하려면 `pages/` 폴더에 마크다운 파일을 추가하세요.

1. `pages/` 폴더에 `.md` 파일 생성
2. Front Matter 작성 (제목, 날짜, 태그 등)
3. 마크다운으로 본문 작성
4. Git 커밋 & 푸시
5. GitHub Actions가 자동으로 배포!

---

즐거운 블로깅 되세요! 🚀

