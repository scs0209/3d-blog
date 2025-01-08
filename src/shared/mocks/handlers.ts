import { http, HttpResponse } from 'msw';

type Todo = {
  id: number;
  name: string;
};

type CreateTodoRequestBody = {
  id: number;
  name: string;
};

type TodosResponseBody = Todo[];
type CreateTodoResponseBody = Todo;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;

// Mock todos rows response
const todos: Todo[] = [{ id: 1, name: 'Do laundry' }];

export const handlers = [
  // GET 요청 핸들러
  http.get<Record<string, never>, never, TodosResponseBody>(
    `${SUPABASE_URL}/rest/v1/todos`,
    async ({ request }) => {
      return HttpResponse.json(todos);
    },
  ),

  // POST 요청 핸들러
  http.post<
    Record<string, never>,
    CreateTodoRequestBody,
    CreateTodoResponseBody
  >(`${SUPABASE_URL}/rest/v1/todos`, async ({ request }) => {
    const newTodo = await request.json();
    todos.push(newTodo);

    return HttpResponse.json(newTodo, { status: 201 });
  }),
];
