import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PlaylistCard from '../../src/components/Playlist/PlaylistCard';

describe('PlaylistCard', () => {
  it('renders the playlist name and description', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PlaylistCard playlist={{ _id: 'playlist-1', name: 'My mixes', description: 'A nice mix' }} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('My mixes')).toBeInTheDocument();
    expect(screen.getByText('A nice mix')).toBeInTheDocument();
  });
});
