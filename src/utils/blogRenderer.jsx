import React from 'react';

/**
 * Strips document wrappers (<!DOCTYPE>, <html>, <head>, <body>),
 * removes Word/MSO tags, and strips invasive inline fonts/colors so typography stays uniform.
 */
export function cleanAndNormalizeHtml(rawInput = '') {
  if (!rawInput) return '';
  let str = String(rawInput).trim();

  // If input contains full HTML document structure (<!DOCTYPE html>, <html>, <head>, <body>),
  // extract only the inner body contents:
  if (/<body[\s>]/i.test(str)) {
    const bodyMatch = str.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      str = bodyMatch[1].trim();
    }
  }

  // Remove doctype, html, head, meta, title, link, style, script tags
  str = str
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<\/?(?:html|head|meta|title|link|style|script)[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(o:p|xml)[^>]*>/gi, '');

  // Strip invasive inline font styles (font-family, explicit font-size, explicit line-height)
  str = str.replace(/style="([^"]*)"/gi, (match, styleVal) => {
    const rules = styleVal
      .split(';')
      .map(r => r.trim())
      .filter(r => {
        if (!r) return false;
        const low = r.toLowerCase();
        if (low.startsWith('font-family')) return false;
        if (low.startsWith('font-size')) return false;
        if (low.startsWith('line-height')) return false;
        if (low.startsWith('color') && !low.includes('border-color')) return false;
        if (low.startsWith('background') && !low.includes('background-image')) return false;
        if (low.startsWith('margin') && (low.includes('pt') || low.includes('in'))) return false;
        return true;
      });
    return rules.length > 0 ? `style="${rules.join('; ')}"` : '';
  });

  // Clean empty spans
  str = str.replace(/<span>([\s\S]*?)<\/span>/gi, '$1');

  return str.trim();
}

/**
 * Universal Content Renderer for Blogs
 * Supports clean Semantic HTML and structured Markdown seamlessly
 * Preserves enterprise typography and theme styling
 */
export function renderBlogContent(content) {
  if (!content) return null;

  // Clean up any outer HTML wrappers or doctype
  const cleaned = cleanAndNormalizeHtml(content);

  // Check if content is primarily HTML (contains tags like <p>, <div>, <h1>, <pre>, <table>, etc.)
  const isHtml = /<\/?(?:p|div|h[1-6]|ul|ol|li|blockquote|table|pre|code|span|strong|em|a|img|b|i|u|br|header|section|article)[\s>/]/i.test(cleaned);

  if (isHtml) {
    return (
      <div 
        className="blog-rich-content text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: cleaned }} 
      />
    );
  }

  // Otherwise render clean structured markdown
  const paragraphs = cleaned.split('\n\n');
  return (
    <div className="blog-rich-content text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
      {paragraphs.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 1
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-8 mb-3 tracking-tight">
              {trimmed.replace(/^#\s+/, '')}
            </h1>
          );
        }

        // Heading 2
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-8 mb-3 tracking-tight">
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }

        // Code block
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const codeLines = lines.slice(1, lines[lines.length - 1].trim() === '```' ? -1 : undefined);
          return (
            <pre key={idx} className="bg-slate-900 text-emerald-300 p-4 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono border border-slate-800 my-4 shadow-sm">
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-emerald-500 italic text-slate-700 dark:text-slate-300 my-4">
              {trimmed.replace(/^>\s*/, '')}
            </blockquote>
          );
        }

        // Bullet list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
          return (
            <ul key={idx} className="list-disc list-inside space-y-1.5 my-3 pl-2 text-slate-700 dark:text-slate-300">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {item.replace(/^[-*]\s+/, '')}
                </li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter(l => /^\d+\.\s/.test(l.trim()));
          return (
            <ol key={idx} className="list-decimal list-inside space-y-1.5 my-3 pl-2 text-slate-700 dark:text-slate-300">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {item.replace(/^\d+\.\s+/, '')}
                </li>
              ))}
            </ol>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
