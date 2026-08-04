import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import WatchHistory from '../../src/components/Video/WatchHistory';
import createTestStore from '../store/testStore';

vi.mock('../../src/services/userService', () => ({
  getUserWatchHistory: vi.fn(() => Promise.resolve({ data: { watchHistory: [] } }))
}));

describe('WatchHistory', () => {
  it('renders the watch history heading', async () => {
    const queryClient = new QueryClient();
    const store = createTestStore({ auth: { authStatus: true, user: null }, theme: { theme: 'light' } });

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter>
            <WatchHistory />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/watch history/i)).toBeInTheDocument();
  });
});
