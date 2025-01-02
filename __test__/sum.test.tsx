// generate simple react testing library test code

import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

test('renders Home component', () => {
  render(<Home />);
  const mainElement = screen.getByRole('main');
  expect(mainElement).toBeInTheDocument();
  expect(mainElement).toHaveTextContent('hi');
});
