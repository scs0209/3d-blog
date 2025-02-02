import * as z from 'zod';

export const postFormSchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  content: z.string().min(1, { message: '내용을 입력해주세요.' }),
  categoryId: z.string().min(1, { message: '카테고리를 선택해주세요.' }),
});

export type PostFormSchema = z.infer<typeof postFormSchema>;
