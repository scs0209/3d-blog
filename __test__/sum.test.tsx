// generate simple react testing library test code

import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';


test('renders Home component', () => {
  render(<Home />);
  const mainElement = screen.getByRole('main');
  expect(mainElement).toBeInTheDocument();
  expect(mainElement).toHaveTextContent('hi');
}); 

// test('adds 1 + 2 to equal 3', () => {
//   expect((2)).toBe(3);
// });