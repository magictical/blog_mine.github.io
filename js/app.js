/**
 * App.js - 메인 애플리케이션 로직
 */
(function() {
  'use strict';

  // 상태 관리
  let allPosts = [];
  let allTags = [];
  let activeTag = null;

  /**
   * posts.json 로드
   */
  async function loadPosts() {
    try {
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error('posts.json을 불러올 수 없습니다.');
      }
      allPosts = await response.json();
      return allPosts;
    } catch (error) {
      console.error('게시글 목록 로드 실패:', error);
      return [];
    }
  }

  /**
   * 모든 태그 추출
   */
  function extractTags(posts) {
    const tagSet = new Set();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }

  /**
   * 태그 필터 렌더링
   */
  function renderTags(tags) {
    const container = document.getElementById('tags-container');
    if (!container) return;

    if (tags.length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<button class="tag active" data-tag="">전체</button>';
    tags.forEach(tag => {
      html += `<button class="tag" data-tag="${tag}">${tag}</button>`;
    });

    container.innerHTML = html;

    // 태그 클릭 이벤트
    container.querySelectorAll('.tag').forEach(button => {
      button.addEventListener('click', () => {
        const tag = button.dataset.tag;
        setActiveTag(tag);
      });
    });
  }

  /**
   * 활성 태그 설정
   */
  function setActiveTag(tag) {
    activeTag = tag || null;

    // 버튼 스타일 업데이트
    const container = document.getElementById('tags-container');
    if (container) {
      container.querySelectorAll('.tag').forEach(button => {
        if (button.dataset.tag === (tag || '')) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    }

    // 검색어와 함께 필터링
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value : '';
    
    filterAndRenderPosts(searchTerm);
  }

  /**
   * 게시글 카드 HTML 생성
   */
  function createPostCard(post) {
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let tagsHTML = '';
    if (post.tags && post.tags.length > 0) {
      tagsHTML = '<div class="post-card-tags">';
      post.tags.forEach(tag => {
        tagsHTML += `<span class="post-card-tag">${tag}</span>`;
      });
      tagsHTML += '</div>';
    }

    return `
      <article class="post-card">
        <h2 class="post-card-title">
          <a href="post.html?post=${encodeURIComponent(post.file)}">${post.title}</a>
        </h2>
        <div class="post-card-meta">
          <span class="post-card-date">${formattedDate}</span>
          ${post.category ? `<span class="post-card-category">${post.category}</span>` : ''}
        </div>
        ${post.excerpt ? `<p class="post-card-excerpt">${post.excerpt}</p>` : ''}
        ${tagsHTML}
      </article>
    `;
  }

  /**
   * 게시글 목록 렌더링
   */
  function renderPosts(posts) {
    const listEl = document.getElementById('posts-list');
    const emptyEl = document.getElementById('empty-state');

    if (!listEl) return;

    if (posts.length === 0) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    let html = '';
    posts.forEach(post => {
      html += createPostCard(post);
    });

    listEl.innerHTML = html;
  }

  /**
   * 검색 및 태그 필터링 후 렌더링
   */
  function filterAndRenderPosts(searchTerm = '') {
    let filtered = [...allPosts];

    // 태그 필터링
    if (activeTag) {
      filtered = filtered.filter(post => 
        post.tags && post.tags.includes(activeTag)
      );
    }

    // 검색어 필터링
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => {
        const titleMatch = post.title && post.title.toLowerCase().includes(term);
        const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(term);
        const tagsMatch = post.tags && post.tags.some(tag => tag.toLowerCase().includes(term));
        const categoryMatch = post.category && post.category.toLowerCase().includes(term);
        
        return titleMatch || excerptMatch || tagsMatch || categoryMatch;
      });
    }

    renderPosts(filtered);
  }

  /**
   * 초기화
   */
  async function init() {
    // 게시글 로드
    const posts = await loadPosts();
    
    // 태그 추출 및 렌더링
    allTags = extractTags(posts);
    renderTags(allTags);

    // 게시글 렌더링
    renderPosts(posts);

    // 검색 기능 연동 (search.js에서 호출)
    window.blogApp = {
      filterAndRenderPosts
    };
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

