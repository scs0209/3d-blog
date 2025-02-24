'use client';

import React, { useState } from 'react';
import { TagInput } from '@/features/tag/ui/tag-input';
import { Button } from '@/shadcn-ui/components/ui/button';
import Modal from '@/shared/ui/modal';

export const CreateTagModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      trigger={<Button variant="default">태그 생성</Button>}
      title="태그 생성"
      description="태그의 이름을 입력하세요."
      open={open}
      onOpenChange={setOpen}
    >
      <TagInput />
    </Modal>
  );
};
