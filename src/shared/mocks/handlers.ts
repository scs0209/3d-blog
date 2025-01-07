import { http } from 'msw';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Mock todos rows response
const todos = [{ id: 1, name: 'Do laundry' }];

if (!SUPABASE_URL) {
  throw new Error('Environment variable NEXT_PUBLIC_SUPABASE_URL is not set.');
}

export const handlers = [
  http.get(`${SUPABASE_URL}/rest/v1/todos`, async (req, res, ctx) => {
    // Return an empty array or a mock response for all GET requests
    return res(ctx.status(200), ctx.json([]));
  }),
];
