import * as z from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: '카테고리 이름을 입력해주세요.' }),
  description: z.string().optional(),
  parentId: z.union([z.number().int().positive(), z.null()]).optional(),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
