import * as z from 'zod';

const passwordSchema = z.string().min(8, {
  message: '비밀번호는 최소 8자 이상이어야 합니다.',
});

export const loginSchema = z.object({
  email: z.string().email({
    message: '유효한 이메일 주소를 입력해주세요.',
  }),
  password: passwordSchema,
});

export const signupSchema = loginSchema
  .extend({
    name: z
      .string()
      .min(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
      .max(50, { message: '이름은 최대 50자 이하여야 합니다.' }),
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
