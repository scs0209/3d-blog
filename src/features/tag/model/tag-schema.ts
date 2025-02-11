import * as z from 'zod';

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, { message: '태그 이름을 입력해주세요.' })
    .max(50, { message: '태그 이름은 50자를 초과할 수 없습니다.' }),
});

export type TagSchema = z.infer<typeof tagSchema>;
