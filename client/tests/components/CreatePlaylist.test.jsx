import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import CreatePlaylist from '../../src/components/Playlist/CreatePlaylist';

vi.mock('../../src/services/playlistService.js', () => ({
  createPlaylist: vi.fn(() => Promise.resolve({ data: { _id: 'playlist-1' } }))
}));

describe('CreatePlaylist', () => {
  it('submits a new playlist', async () => {
    const queryClient = new QueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreatePlaylist />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await user.type(screen.getByPlaceholderText(/enter playlist name/i), 'My list');
    await user.type(screen.getByPlaceholderText(/enter playlist description/i), 'Great videos');
    await user.click(screen.getByRole('button', { name: /^create playlist$/i }));

    expect(screen.getByRole('heading', { name: /create playlist/i })).toBeInTheDocument();
  });
});
