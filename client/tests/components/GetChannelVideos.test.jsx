import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import GetChannelVideos from '../../src/components/Channel/GetChannelVideos';
import createTestStore from '../store/testStore';

vi.mock('../../src/services/videoService.js', () => ({
  getChannelVideos: vi.fn(() => Promise.resolve({ data: [] }))
}));

describe('GetChannelVideos', () => {
  it('shows an empty-state message when the channel has no videos', async () => {
    const queryClient = new QueryClient();
    const store = createTestStore({ theme: { theme: 'light' } });

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter>
            <GetChannelVideos username="demo" />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/no vidoes/i)).toBeInTheDocument();
  });
});
