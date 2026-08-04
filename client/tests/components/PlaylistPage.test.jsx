import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import PlaylistPage from '../../src/components/Playlist/PlaylistPage';

vi.mock('../../src/services/playlistService', () => ({
  getPlaylistById: vi.fn(() => Promise.resolve({ data: { name: 'My list', description: 'Cool mix', videos: [] } }))
}));

describe('PlaylistPage', () => {
  it('renders the playlist details', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PlaylistPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/playlist:/i)).toBeInTheDocument();
    expect(screen.getByText(/my list/i)).toBeInTheDocument();
  });
});
