'use client';

import { TagInput } from '@/features/tag/ui/tag-input';
import { Button } from '@/shadcn-ui/components/ui/button';
import Modal from '@/shared/ui/modal';
import { useState } from 'react';

export const CreateTagModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      trigger={<Button variant='ghost' className='w-full h-full opacity-0 absolute inset-0 cursor-pointer' />}
      title='태그 생성'
      description='태그의 이름을 입력하세요.'
      open={open}
      onOpenChange={setOpen}
    >
      <TagInput />
    </Modal>
  );
};
