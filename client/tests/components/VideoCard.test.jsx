import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VideoCard from '../../src/components/Video/VideoCard';
import createTestStore from '../store/testStore';

vi.mock('../../src/services/playlistService', () => ({
  addVideoToPlaylist: vi.fn(() => Promise.resolve({ message: 'Added' })),
  removeVideoFromPlaylist: vi.fn(() => Promise.resolve({ message: 'Removed' }))
}));

describe('VideoCard', () => {
  it('renders the title and metadata for a video card', () => {
    const queryClient = new QueryClient();
    const store = createTestStore({ theme: { theme: 'light' } });

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter>
            <VideoCard video={{
              _id: 'video-1',
              title: 'Demo video',
              thumbnail: 'thumb.png',
              duration: '3.5',
              views: 12,
              createdAt: new Date().toISOString(),
              owner: { username: 'demo', avatar: 'avatar.png' }
            }} />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    expect(screen.getByText('Demo video')).toBeInTheDocument();
    expect(screen.getByText(/views/i)).toBeInTheDocument();
  });
});
