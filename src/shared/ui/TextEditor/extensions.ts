import {
  AIHighlight,
  CharacterCount,
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
import { UploadImagesPlugin } from 'novel/plugins';
import { cx } from 'class-variance-authority';
import { createCodeBlockExtension } from './code-block-extension';

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
    color: 'rgba(255, 255, 255, 0.35)',
    width: 2,
  },
  gapcursor: false,
});

const codeBlockLowlight = createCodeBlockExtension('all');

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
      class: cx(
        'admin-post-table my-4 table-auto w-max max-w-full border-separate border-spacing-0 overflow-hidden rounded-lg border border-white/20',
      ),
    },
  },
  tableRow: {
    HTMLAttributes: {
      class: cx('border-b border-white/10 last:border-b-0'),
    },
  },
  tableHeader: {
    HTMLAttributes: {
      class: cx(
        'border-b border-white/15 bg-white/10 px-2.5 py-1.5 text-left text-xs font-medium text-white',
      ),
    },
  },
  tableCell: {
    HTMLAttributes: {
      class: cx('px-2.5 py-1.5 text-xs leading-snug text-white/85'),
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
