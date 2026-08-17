import {
  CodeBlockLowlight,
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
import { common, createLowlight } from 'lowlight';

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
      class: cx('list-disc list-outside leading-3 -mt-2'),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx('list-decimal list-outside leading-3 -mt-2'),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx('leading-normal -mb-2'),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx('border-l-4 border-primary'),
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

const lowlight = createLowlight(common);

const codeBlockLowlight = CodeBlockLowlight.configure({
  lowlight,
  HTMLAttributes: {
    class: cx('rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium'),
  },
});

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
      class: cx('border-collapse border-2 border-gray-500 dark:border-gray-400 my-6 w-full'),
    },
  },
  tableRow: {
    HTMLAttributes: {
      class: cx('border-b border-gray-400 dark:border-gray-500'),
    },
  },
  tableHeader: {
    HTMLAttributes: {
      class: cx(
        'border border-gray-500 dark:border-gray-400 bg-gray-700 px-4 py-3 text-left font-semibold text-foreground',
      ),
    },
  },
  tableCell: {
    HTMLAttributes: {
      class: cx('border border-gray-500 dark:border-gray-400 px-4 py-3 text-foreground'),
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
