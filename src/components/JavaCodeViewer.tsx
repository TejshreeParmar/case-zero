import React from 'react';

interface JavaCodeViewerProps {
  code: string;
  isInteractiveLineSelect?: boolean;
  selectedLine?: number | null;
  onSelectLine?: (line: number) => void;
  targetLineHighlight?: number | null;
  isCorrectedView?: boolean;
}

export const JavaCodeViewer: React.FC<JavaCodeViewerProps> = ({
  code,
  isInteractiveLineSelect = false,
  selectedLine = null,
  onSelectLine,
  targetLineHighlight = null,
  isCorrectedView = false
}) => {
  const lines = code.split('\n');

  // Simple token highlighter for Java
  const highlightJava = (text: string) => {
    // Check for comment
    const commentIdx = text.indexOf('//');
    let codePart = text;
    let commentPart = '';

    if (commentIdx !== -1) {
      codePart = text.substring(0, commentIdx);
      commentPart = text.substring(commentIdx);
    }

    const keywords = [
      'public', 'private', 'protected', 'static', 'final', 'class', 'interface', 
      'extends', 'implements', 'void', 'int', 'double', 'float', 'boolean', 
      'char', 'byte', 'short', 'long', 'new', 'return', 'if', 'else', 
      'while', 'for', 'try', 'catch', 'finally', 'throw', 'throws', 
      'synchronized', 'volatile', 'transient', 'this', 'super', 'null', 
      'true', 'false', 'break', 'continue', 'import', 'package'
    ];

    // Escape HTML chars
    let escaped = codePart
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Annotations (e.g., @Override)
    escaped = escaped.replace(/(@[A-Za-z0-9_]+)/g, '<span class="text-pink-400 font-semibold">$1</span>');

    // Strings
    escaped = escaped.replace(/(".*?")/g, '<span class="text-amber-300">$1</span>');

    // Keywords
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-emerald-400 font-semibold">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?f?)\b/g, '<span class="text-cyan-300">$1</span>');

    // Reattach comment if present
    if (commentPart) {
      const escapedComment = commentPart
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      escaped += `<span class="text-slate-500 italic">${escapedComment}</span>`;
    }

    return escaped;
  };

  return (
    <div className="w-full bg-slate-950 font-code text-xs sm:text-sm text-slate-200 overflow-x-auto select-text p-2 sm:p-3 rounded border border-slate-800">
      {lines.map((line, idx) => {
        const lineNum = idx + 1;
        const isSelected = selectedLine === lineNum;
        const isTarget = targetLineHighlight === lineNum;

        return (
          <div
            key={idx}
            onClick={() => {
              if (isInteractiveLineSelect && onSelectLine) {
                onSelectLine(lineNum);
              }
            }}
            className={`flex items-start py-0.5 px-2 rounded transition-colors ${
              isInteractiveLineSelect ? 'cursor-pointer hover:bg-slate-900/90' : ''
            } ${
              isSelected
                ? 'bg-amber-950/60 border-l-4 border-amber-400 text-amber-200'
                : isTarget
                ? 'bg-red-950/50 border-l-4 border-red-500 text-red-200 font-semibold'
                : isCorrectedView
                ? 'hover:bg-emerald-950/20'
                : ''
            }`}
          >
            {/* Line number */}
            <span className="w-8 text-right pr-4 text-slate-600 select-none flex-shrink-0 font-terminal text-sm">
              {lineNum}
            </span>

            {/* Line content */}
            <span
              className="flex-1 whitespace-pre leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightJava(line) }}
            />

            {/* Selected line badge */}
            {isSelected && isInteractiveLineSelect && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-pixel bg-amber-400 text-black rounded-none select-none">
                CLICKED LINE #{lineNum}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
