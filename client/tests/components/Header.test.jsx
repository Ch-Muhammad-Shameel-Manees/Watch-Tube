import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../src/components/Layout/Header';
import createTestStore from '../store/testStore';

describe('Header', () => {
  it('renders the login and sign up links for guests', () => {
    const store = createTestStore({
      auth: { authStatus: false, user: null },
      theme: { theme: 'light' }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
});
