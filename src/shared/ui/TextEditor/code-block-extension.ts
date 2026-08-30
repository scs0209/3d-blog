import { CodeBlockLowlight } from 'novel/extensions';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { all, common, createLowlight } from 'lowlight';
import CodeBlock, { shouldStopCodeBlockEvent } from './code-block';

export const createCodeBlockExtension = (scope: 'all' | 'common' = 'all') => {
  const lowlight = scope === 'all' ? createLowlight(all) : createLowlight(common);

  return CodeBlockLowlight.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        mode: {
          default: 0,
          parseHTML: (element) => Number.parseInt(element.getAttribute('data-mode') || '0', 10),
          renderHTML: (attributes) => ({
            'data-mode': attributes.mode,
          }),
        },
      };
    },
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlock, {
        as: 'div',
        className: 'code-block-root',
        stopEvent: shouldStopCodeBlockEvent,
      });
    },
  }).configure({ lowlight });
};
