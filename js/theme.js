/**
 * Theme Toggle - 다크/라이트 모드 전환
 */
(function() {
  'use strict';

  const THEME_KEY = 'blog-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  /**
   * 저장된 테마 또는 시스템 설정 가져오기
   */
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // 시스템 다크 모드 감지
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  /**
   * 테마 적용
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  /**
   * 테마 토글
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const newTheme = currentTheme === DARK ? LIGHT : DARK;
    applyTheme(newTheme);
  }

  /**
   * 초기화
   */
  function init() {
    // 페이지 로드 시 테마 적용
    applyTheme(getPreferredTheme());

    // 테마 토글 버튼 이벤트 리스너
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }

    // 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // 사용자가 수동으로 설정하지 않은 경우에만 자동 변경
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 전역 API 노출 (Giscus 테마 동기화용)
  window.blogTheme = {
    get: getPreferredTheme,
    set: applyTheme,
    toggle: toggleTheme
  };
})();

