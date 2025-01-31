import * as z from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: '카테고리 이름을 입력해주세요.' }),
  slug: z
    .string()
    .min(1, { message: '슬러그를 입력해주세요.' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: '슬러그는 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.',
    }),
  description: z.string().optional(),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;
