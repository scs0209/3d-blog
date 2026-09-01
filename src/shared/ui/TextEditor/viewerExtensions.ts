import {
  Color,
  HighlightExtension,
  HorizontalRule,
  Mathematics,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  UpdatedImage,
  Youtube,
} from 'novel/extensions';
import { TableKit } from '@tiptap/extension-table';
import { cx } from 'class-variance-authority';
import { createCodeBlockExtension } from './code-block-extension';

const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer',
    ),
  },
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted'),
  },
});

const tiptapImage = TiptapImage.configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted'),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx('not-prose pl-2 '),
  },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx('flex gap-2 items-start my-4'),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx('mt-4 mb-6 border-t border-muted-foreground'),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx('my-4 list-outside list-disc space-y-1.5 pl-6'),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx('my-4 list-outside list-decimal space-y-1.5 pl-6'),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx('leading-relaxed pl-0.5'),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx('my-4 pl-4'),
    },
  },
  codeBlock: false,
  code: {
    HTMLAttributes: {
      class: cx('rounded-md bg-gray-800 px-1.5 py-1 font-mono font-medium'),
      spellcheck: 'false',
    },
  },
  horizontalRule: false,
  dropcursor: false,
  gapcursor: false,
});

const codeBlockLowlight = createCodeBlockExtension('all');

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted'),
  },
  inline: false,
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: cx('text-foreground rounded p-1 hover:bg-accent cursor-pointer'),
  },
  katexOptions: {
    throwOnError: false,
  },
});

const tableKit = TableKit.configure({
  table: {
    HTMLAttributes: {
      class: cx('blog-post-table my-4 table-auto w-max max-w-full'),
    },
  },
  tableHeader: {
    HTMLAttributes: {
      class: cx('text-left text-xs font-medium'),
    },
  },
  tableCell: {
    HTMLAttributes: {
      class: cx('text-xs leading-snug'),
    },
  },
});

/** 읽기 전용 뷰어용 — 드래그/업로드/AI/머메이드 노드뷰 등 편집기 전용 확장 제외 */
export const viewerExtensions = [
  starterKit,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  codeBlockLowlight,
  youtube,
  mathematics,
  TiptapUnderline,
  tableKit,
  HighlightExtension,
  TextStyle,
  Color,
];
