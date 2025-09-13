import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  test('renders Button component', () => {
    render(<Button>Post</Button>);
    const buttonElement = screen.getByText(/Post/i);
    expect(buttonElement).toBeDefined();
  });
});
