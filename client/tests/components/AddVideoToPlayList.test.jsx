import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import AddVideoToPlaylist from '../../src/components/Playlist/AddVideoToPlayList';
import createTestStore from '../store/testStore';

vi.mock('../../src/services/playlistService', () => ({
  addVideoToPlaylist: vi.fn(() => Promise.resolve({ message: 'Added' })),
  getUserPlaylists: vi.fn(() => Promise.resolve({ data: [] }))
}));

describe('AddVideoToPlaylist', () => {
  it('shows the empty-state message when the user has no playlists', async () => {
    const queryClient = new QueryClient();
    const store = createTestStore({ theme: { theme: 'light' } });

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter>
            <AddVideoToPlaylist videoId="video-1" />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/no playlists available/i)).toBeInTheDocument();
  });
});
