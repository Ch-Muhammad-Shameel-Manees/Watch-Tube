import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import HeaderProfile from '../../src/components/Layout/HeaderProfile';
import createTestStore from '../store/testStore';

vi.mock('../../src/services/userService', () => ({
  logout: vi.fn(() => Promise.resolve())
}));

describe('HeaderProfile', () => {
  it('renders the logout action', () => {
    const store = createTestStore({
      auth: { authStatus: true, user: { username: 'demo' } },
      theme: { theme: 'light' }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HeaderProfile user={{ username: 'demo' }} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
