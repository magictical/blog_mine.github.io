/**
 * Post Loader - 마크다운 게시글 로딩 및 렌더링
 */
(function () {
  "use strict";

  /**
   * URL 쿼리 파라미터에서 게시글 파일명 추출
   */
  function getPostFile() {
    const params = new URLSearchParams(window.location.search);
    return params.get("post");
  }

  /**
   * Front Matter 파싱
   */
  function parseFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
      return { metadata: {}, content: content };
    }

    const frontMatter = match[1];
    const postContent = match[2];
    const metadata = {};

    // 라인별 파싱
    const lines = frontMatter.split("\n");
    lines.forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === "tags" && value.startsWith("[") && value.endsWith("]")) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value
              .slice(1, -1)
              .split(",")
              .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ""));
          }
        }

        metadata[key] = value;
      }
    });

    return { metadata, content: postContent };
  }

  /**
   * 게시글 헤더 렌더링
   */
  function renderPostHeader(metadata) {
    const titleEl = document.getElementById("post-title");
    const metaEl = document.getElementById("post-meta");

    if (titleEl && metadata.title) {
      titleEl.textContent = metadata.title;
      document.title = `${metadata.title} - magictical's Blog`;
    }

    if (metaEl) {
      let metaHTML = "";

      // 날짜
      if (metadata.date) {
        const date = new Date(metadata.date);
        const formattedDate = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        metaHTML += `<span class="post-date">${formattedDate}</span>`;
      }

      // 카테고리
      if (metadata.category) {
        metaHTML += `<span class="post-category">${metadata.category}</span>`;
      }

      // 태그
      if (metadata.tags && Array.isArray(metadata.tags)) {
        metaHTML += '<div class="post-tags">';
        metadata.tags.forEach((tag) => {
          metaHTML += `<span class="post-card-tag">${tag}</span>`;
        });
        metaHTML += "</div>";
      }

      metaEl.innerHTML = metaHTML;
    }
  }

  /**
   * 마크다운 → HTML 변환 및 렌더링
   */
  function renderPostContent(markdownContent) {
    const contentEl = document.getElementById("post-content");

    if (!contentEl) return;

    // marked.js 설정
    if (typeof marked !== "undefined") {
      marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
      });

      const html = marked.parse(markdownContent);
      contentEl.innerHTML = html;

      // Prism.js로 코드 하이라이팅
      if (typeof Prism !== "undefined") {
        Prism.highlightAllUnder(contentEl);
      }
    } else {
      contentEl.innerHTML = "<p>마크다운 파서를 불러오는 데 실패했습니다.</p>";
    }
  }

  /**
   * Giscus 댓글 로드
   */
  function loadGiscus() {
    const container = document.getElementById("giscus-container");
    if (!container) return;

    // 현재 테마 가져오기
    const theme =
      document.documentElement.getAttribute("data-theme") || "light";
    const giscusTheme = theme === "dark" ? "dark" : "light";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "magictical/blog_mine.github.io");
    script.setAttribute("data-repo-id", "R_kgDOQec0aw"); // Giscus 설정 후 변경 필요
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOQec0a84CzIz0"); // Giscus 설정 후 변경 필요
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "1");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", giscusTheme);
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    container.appendChild(script);

    // 테마 변경 시 Giscus 테마도 변경
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const newTheme = document.documentElement.getAttribute("data-theme");
          const iframe = document.querySelector("iframe.giscus-frame");
          if (iframe) {
            iframe.contentWindow.postMessage(
              {
                giscus: {
                  setConfig: { theme: newTheme === "dark" ? "dark" : "light" },
                },
              },
              "https://giscus.app"
            );
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
  }

  /**
   * 에러 표시
   */
  function showError(message) {
    const contentEl = document.getElementById("post-content");
    const titleEl = document.getElementById("post-title");

    if (titleEl) {
      titleEl.textContent = "오류";
    }

    if (contentEl) {
      contentEl.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem;">
          <p style="color: var(--text-muted); margin-bottom: 1rem;">${message}</p>
          <a href="index.html" class="back-link" style="display: inline-flex;">목록으로 돌아가기</a>
        </div>
      `;
    }
  }

  /**
   * 게시글 로드
   */
  async function loadPost() {
    const postFile = getPostFile();

    if (!postFile) {
      showError("게시글을 찾을 수 없습니다.");
      return;
    }

    try {
      const response = await fetch(`pages/${postFile}`);

      if (!response.ok) {
        throw new Error("게시글을 불러올 수 없습니다.");
      }

      const content = await response.text();
      const { metadata, content: postContent } = parseFrontMatter(content);

      renderPostHeader(metadata);
      renderPostContent(postContent);
      loadGiscus();
    } catch (error) {
      console.error("게시글 로드 실패:", error);
      showError("게시글을 불러오는 중 오류가 발생했습니다.");
    }
  }

  // DOM 로드 후 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPost);
  } else {
    loadPost();
  }
})();
