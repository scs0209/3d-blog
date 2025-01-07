import { http } from 'msw';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Mock todos rows response
const todos = [{ id: 1, name: 'Do laundry' }];

export const handlers = [
  http.get(`${SUPABASE_URL}/rest/v1/todos`, async (req, res, ctx) => {
    return res(ctx.json(todos));
  }),
  http.post(`${SUPABASE_URL}/rest/v1/todos`, async (req, res, ctx) => {
    const newTodo = await req.json();
    todos.push(newTodo);
    return res(ctx.status(201), ctx.json(newTodo));
  }),
];
