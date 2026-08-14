import MarkdownIt from 'markdown-it';

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: false,
});

// 让表格渲染出 thead/tbody，便于后续样式
md.renderer.rules.table_open = () => '<table class="md-table">\n';
md.renderer.rules.thead_open = () => '<thead>\n';
md.renderer.rules.tbody_open = () => '<tbody>\n';

export function renderMarkdown(src: string): string {
  return md.render(src ?? '');
}
