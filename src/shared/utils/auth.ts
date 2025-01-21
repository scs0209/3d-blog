export async function signUp({ name, email, password }: any) {
  const response = await fetch(`/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const result = await response.json();
  return result;
}
