import { rest } from 'msw';
import { setupServer } from 'msw/node';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;

// Mock todos rows response
const todos = [{ id: 1, name: 'Do laundry' }];

export const handlers = rest.all(
  `${SUPABASE_URL}/rest/v1/todos`,
  async (req, res, ctx) => {
    switch (req.method) {
      case 'GET':
        return res(ctx.json(todos));
      default:
        return res(ctx.json('Unhandled method'));
    }
  },
);
