import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from '../..//src/components/ui';

describe('Input', () => {
  it('renders the label and placeholder', () => {
    render(<Input label="Username" placeholder="Enter username" />);

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('supports typing and forwards the value', async () => {
    const user = userEvent.setup();
    render(<Input label="Email" placeholder="Enter email" />);

    const input = screen.getByPlaceholderText('Enter email');
    await user.type(input, 'test@example.com');

    expect(input).toHaveValue('test@example.com');
  });

  it('renders validation error text when provided', () => {
    render(<Input label="Password" error="Password is required" />);

    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});
