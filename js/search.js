/**
 * Search.js - 클라이언트 사이드 검색 기능
 */
(function() {
  'use strict';

  let debounceTimer = null;
  const DEBOUNCE_DELAY = 300;

  /**
   * 디바운스 함수
   */
  function debounce(func, delay) {
    return function(...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * 검색 실행
   */
  function performSearch(searchTerm) {
    // app.js의 필터 함수 호출
    if (window.blogApp && typeof window.blogApp.filterAndRenderPosts === 'function') {
      window.blogApp.filterAndRenderPosts(searchTerm);
    }
  }

  /**
   * 초기화
   */
  function init() {
    const searchInput = document.getElementById('search-input');
    
    if (!searchInput) return;

    // 디바운스된 검색 함수
    const debouncedSearch = debounce(performSearch, DEBOUNCE_DELAY);

    // 입력 이벤트
    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });

    // Enter 키로 즉시 검색
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(debounceTimer);
        performSearch(searchInput.value);
      }
    });

    // ESC 키로 검색어 초기화
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        performSearch('');
        searchInput.blur();
      }
    });

    // 키보드 단축키: Ctrl/Cmd + K로 검색창 포커스
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

