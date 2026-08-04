import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import UserPlaylists from '../../src/components/Playlist/UserPlaylists';
import createTestStore from '../store/testStore';

vi.mock('../../src/services/playlistService.js', () => ({
  getUserPlaylists: vi.fn(() => Promise.resolve({ data: [] }))
}));

describe('UserPlaylists', () => {
  it('renders the empty-state message when there are no playlists', async () => {
    const queryClient = new QueryClient();
    const store = createTestStore({ auth: { authStatus: true, user: null }, theme: { theme: 'light' } });

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter>
            <UserPlaylists />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/you have no playlists/i)).toBeInTheDocument();
  });
});
