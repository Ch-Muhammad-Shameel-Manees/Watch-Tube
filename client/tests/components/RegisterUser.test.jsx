import { render, screen } from '@testing-library/react';
import { RegisterUser } from '../../src/components/User';
import createTestStore from '../store/testStore.js';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

vi.mock(import('../../src/services/userService'), () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
}));

import { registerUser, loginUser } from '../../src/services/userService';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const MemoryRouterHelper = () => {
  return (
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path='/register' element={<RegisterUser />} />
        <Route path='/' element={<h1>Registered and redirected to homepage</h1>} />
      </Routes>
    </MemoryRouter>
  );
};

function renderRegister(queryClient, store) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouterHelper />
      </Provider>
    </QueryClientProvider>
  );
}

describe('Register User', () => {
  it('should render the RegisterUser component', () => {
    const queryClient = new QueryClient();
    const store = createTestStore({
      auth: {
        authStatus: false,
      },
    });

    render(renderRegister(queryClient, store));

    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should show required field errors when submitting empty form', async () => {
    const queryClient = new QueryClient();
    const store = createTestStore({
      auth: {
        authStatus: false,
      },
    });

    render(renderRegister(queryClient, store));

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText('Username is required!')).toBeInTheDocument();
    expect(await screen.findByText('Email is required!')).toBeInTheDocument();
    expect(await screen.findByText('Full Name is required!')).toBeInTheDocument();
    expect(await screen.findByText('Password is required!')).toBeInTheDocument();
    expect(await screen.findByText('Avatar is required!')).toBeInTheDocument();
  });

  it('should register and redirect after successful submission', async () => {
    vi.mocked(registerUser).mockResolvedValue({
      data: {
        username: 'shameel12',
      },
    });

    vi.mocked(loginUser).mockResolvedValue({
      data: {
        username: 'shameel12',
      },
    });

    const queryClient = new QueryClient();
    const store = createTestStore({
      auth: {
        authStatus: false,
      },
    });

    render(renderRegister(queryClient, store));

    const user = userEvent.setup();

    const usernameInput = document.querySelector('input[name="username"]');
    const emailInput = document.querySelector('input[name="email"]');
    const fullNameInput = document.querySelector('input[name="fullName"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const avatarInput = document.querySelector('input[name="avatar"]');

    await user.type(usernameInput, 'shameel12');
    await user.type(emailInput, 'shameel@example.com');
    await user.type(fullNameInput, 'Shameel Manees');
    await user.type(passwordInput, 'secret123');

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    await user.upload(avatarInput, file);

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/registered and redirected/i)).toBeInTheDocument();
  });
});
