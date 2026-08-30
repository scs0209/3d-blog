'use client';

import { type ReactNode, useState } from 'react';
import { TagInput } from '@/features/tag/ui/tag-input';
import { Button } from '@/shadcn-ui/components/ui/button';
import Modal from '@/shared/ui/modal';

type CreateTagModalProps = {
  trigger?: ReactNode;
};

export const CreateTagModal = ({ trigger }: CreateTagModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      trigger={
        trigger ?? (
          <Button
            variant='ghost'
            className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
            aria-label='태그 추가'
          />
        )
      }
      title='태그 생성'
      description='태그의 이름을 입력하세요.'
      open={open}
      onOpenChange={setOpen}
    >
      <TagInput />
    </Modal>
  );
};
