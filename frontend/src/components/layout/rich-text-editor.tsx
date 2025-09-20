'use client';

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faList } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface RichTextEditorRef {
  reset: () => void;
  focus: () => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);
    const [editorKey, setEditorKey] = useState(0);
    const [isBoldActive, setIsBoldActive] = useState(false);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
          onChange('');
          setEditorKey(prev => prev + 1);
        }
      },
      focus: () => {
        editorRef.current?.focus();
      }
    }));

    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }, [value]);

    // API'ye yalın HTML gönder
    const handleInput = () => {
      if (!editorRef.current) return;
      onChange(editorRef.current.innerHTML);
    };

    const validateEditorContext = (): boolean => {
      if (!editorRef.current) return false;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;
      const range = selection.getRangeAt(0);
      return editorRef.current.contains(range.commonAncestorContainer);
    };

    const closestElement = (node: Node | null, tagName: string): HTMLElement | null => {
      const target = tagName.toUpperCase();
      while (node && node !== editorRef.current) {
        if (node instanceof HTMLElement && node.tagName === target) return node;
        node = node.parentNode as Node | null;
      }
      return null;
    };

    const isInListContext = (): boolean => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return false;
      const range = sel.getRangeAt(0);
      return !!closestElement(range.startContainer, 'LI');
    };

    const placeCaretInside = (el: Node, atEnd = false) => {
      const sel = window.getSelection();
      if (!sel) return;
      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(!atEnd ? true : false);
      sel.removeAllRanges();
      sel.addRange(r);
    };

    const applyBold = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!validateEditorContext()) {
        editorRef.current?.focus();
        return;
      }

      try {
        document.execCommand('bold', false);
        setIsBoldActive(!isBoldActive);
        handleInput();
      } catch (error) {
        console.warn('Bold command failed:', error);
      }

      editorRef.current?.focus();
    };

    const addList = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!validateEditorContext()) {
        editorRef.current?.focus();
        return;
      }

      try {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);

        const currentUL = closestElement(range.startContainer, 'UL');
        const currentLI = closestElement(range.startContainer, 'LI');

        if (currentUL && currentLI) {
          const newLi = document.createElement('li');
          const br = document.createElement('br');
          newLi.appendChild(br);

          if (currentLI.parentNode === currentUL) {
            currentUL.insertBefore(newLi, currentLI.nextSibling);
          } else {
            currentUL.appendChild(newLi);
          }

          placeCaretInside(newLi);
          handleInput();
          editorRef.current?.focus();
          return;
        }

        const ul = document.createElement('ul');
        const li = document.createElement('li');
        li.appendChild(document.createElement('br'));
        ul.appendChild(li);

        range.collapse(true);
        range.insertNode(ul);

        placeCaretInside(li);
        handleInput();
      } catch (error) {
        console.warn('Add list failed:', error);
      }

      editorRef.current?.focus();
    };

    const insertLineBreak = () => {
      if (!validateEditorContext()) {
        editorRef.current?.focus();
        return;
      }

      try {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Cursor'un bulunduğu pozisyondan satır başına kadar olan içeriği kontrol et
          const startContainer = range.startContainer;
          const startOffset = range.startOffset;
          
          let lineContentBeforeCursor = '';
          
          if (startContainer.nodeType === Node.TEXT_NODE) {
            // Text node içindeyse, cursor'dan önceki metni al
            const textContent = startContainer.textContent || '';
            
            // Cursor'dan önceki karakterleri kontrol et, son \n veya br'den sonrasını al
            let lineStart = textContent.lastIndexOf('\n', startOffset - 1);
            if (lineStart === -1) lineStart = 0;
            else lineStart += 1;
            
            lineContentBeforeCursor = textContent.substring(lineStart, startOffset);
          } else {
            // Element node içindeyse, cursor'dan önceki sibling'ları kontrol et
            const parent = startContainer as Element;
            for (let i = 0; i < startOffset; i++) {
              const child = parent.childNodes[i];
              if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent || '';
                const lastNewlineIndex = text.lastIndexOf('\n');
                if (lastNewlineIndex !== -1) {
                  lineContentBeforeCursor = text.substring(lastNewlineIndex + 1);
                } else {
                  lineContentBeforeCursor += text;
                }
              } else if (child.nodeName === 'BR') {
                lineContentBeforeCursor = '';
              }
            }
          }
          
          // Satır başından cursor'a kadar herhangi bir görünür karakter var mı kontrol et
          const hasContentBeforeCursor = lineContentBeforeCursor.trim().length > 0;
          
          const br1 = document.createElement('br');
          range.deleteContents();
          range.insertNode(br1);
          range.setStartAfter(br1);
          
          // Sadece cursor'dan önce içerik varsa ikinci br ekle
          if (hasContentBeforeCursor) {
            const br2 = document.createElement('br');
            range.insertNode(br2);
            range.setStartAfter(br2);
            range.setEndAfter(br2);
          } else {
            range.setEndAfter(br1);
          }
          
          selection.removeAllRanges();
          selection.addRange(range);
          handleInput();
        }
      } catch (error) {
        console.warn('BR insertion failed:', error);
      }

      editorRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isInListContext()) {
          return;
        }
        e.preventDefault();
        insertLineBreak();
      }
    };

    return (
      <div key={editorKey} className={cn('border rounded-md relative', className)}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b bg-muted/20">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={applyBold}
            className={cn(
              "h-8 w-8 p-0 select-none",
              isBoldActive && "bg-accent text-accent-foreground dark:bg-accent/50"
            )}
            tabIndex={-1}
            title="Kalın"
          >
            <FontAwesomeIcon icon={faBold} className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={addList}
            className="h-8 w-8 p-0 select-none"
            tabIndex={-1}
            title="Liste ekle"
          >
            <FontAwesomeIcon icon={faList} className="h-3 w-3" />
          </Button>
        </div>

        {/* Editor */}
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onFocus={() => setIsEditorFocused(true)}
            onBlur={() => setIsEditorFocused(false)}
            onKeyDown={handleKeyDown}
            className={cn(
              'rich-html',
              'min-h-32 max-h-96 overflow-y-auto p-3 text-sm outline-none',
              'focus:ring-2 focus:ring-ring focus:ring-offset-2',
              !value && !isEditorFocused && 'text-muted-foreground'
            )}
            style={{ whiteSpace: 'pre-wrap' }}
            data-placeholder={placeholder}
          />

          {!value && !isEditorFocused && placeholder && (
            <div className="absolute inset-x-3 top-3 text-muted-foreground text-sm pointer-events-none">
              {placeholder}
            </div>
          )}
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';