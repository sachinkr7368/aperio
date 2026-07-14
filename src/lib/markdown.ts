/** Lightweight safe-ish markdown → HTML for API descriptions */
export function renderMarkdown(md: string): string {
  if (!md) return "";
  let html = escapeHtml(md);

  // fenced code
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_m, _lang, code) =>
      `<pre class="md-pre"><code>${code.replace(/\n$/, "")}</code></pre>`
  );

  // inline code
  html = html.replace(/`([^`]+)`/g, "<code class=\"md-code\">$1</code>");

  // bold / italic
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // links
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="md-link">$1</a>'
  );

  // headers
  html = html.replace(/^### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2 class="md-h2">$1</h2>');

  // unordered lists
  html = html.replace(
    /(?:^|\n)((?:- .+(?:\n|$))+)/g,
    (block) => {
      const items = block
        .trim()
        .split("\n")
        .map((l) => l.replace(/^- /, ""))
        .map((l) => `<li>${l}</li>`)
        .join("");
      return `<ul class="md-ul">${items}</ul>`;
    }
  );

  // paragraphs / line breaks
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      if (
        block.startsWith("<h") ||
        block.startsWith("<ul") ||
        block.startsWith("<pre")
      ) {
        return block;
      }
      return `<p class="md-p">${block.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");

  return html;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
