import { render, screen } from '@testing-library/react';
import Button from '../Button';

test('renders Button component', () => {
  render(<Button />);
  const buttonElement = screen.getByText(/Button/i);
  expect(buttonElement).toBeInTheDocument();
});
