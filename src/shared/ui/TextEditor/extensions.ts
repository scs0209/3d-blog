import {
  AIHighlight,
  CharacterCount,
  CodeBlockLowlight,
  Color,
  CustomKeymap,
  GlobalDragHandle,
  HighlightExtension,
  HorizontalRule,
  MarkdownExtension,
  Mathematics,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  Twitter,
  UpdatedImage,
  Youtube,
} from 'novel/extensions';
import { TableKit } from '@tiptap/extension-table';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CodeBlock from './code-block';
import { UploadImagesPlugin } from 'novel/plugins';

import { cx } from 'class-variance-authority';
import { all, createLowlight } from 'lowlight';

// TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects
const aiHighlight = AIHighlight;
// You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer',
    ),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx('opacity-40 rounded-lg border border-stone-200'),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted'),
  },
});

const updatedImage = UpdatedImage.configure({
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
  codeBlock: {
    HTMLAttributes: {
      class: cx('rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium'),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx('rounded-md bg-gray-800 px-1.5 py-1 font-mono font-medium'),
      spellcheck: 'false',
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: '#DBEAFE',
    width: 4,
  },
  gapcursor: false,
});

const lowlight = createLowlight(all);

const codeBlockLowlight = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      mode: {
        default: 0, // MODE.EDIT
        parseHTML: (element) => Number.parseInt(element.getAttribute('data-mode') || '0'),
        renderHTML: (attributes) => {
          return {
            'data-mode': attributes.mode,
          };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlock);
  },
}).configure({ lowlight });

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted'),
  },
  inline: false,
});

const twitter = Twitter.configure({
  HTMLAttributes: {
    class: cx('not-prose'),
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

const characterCount = CharacterCount.configure();

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

const markdownExtension = MarkdownExtension.configure({
  html: true,
  tightLists: true,
  tightListClass: 'tight',
  bulletListMarker: '-',
  linkify: false,
  breaks: false,
  transformPastedText: true,
  transformCopiedText: true,
});

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  codeBlockLowlight,
  youtube,
  twitter,
  mathematics,
  characterCount,
  TiptapUnderline,
  tableKit,
  markdownExtension,
  HighlightExtension,
  TextStyle,
  Color,
  CustomKeymap,
  GlobalDragHandle,
];
