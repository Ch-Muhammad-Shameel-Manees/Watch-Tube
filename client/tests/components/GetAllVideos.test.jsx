import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import GetAllVideos from '../../src/components/Video/GetAllVideos';
import createTestStore from '../store/testStore';

describe('GetAllVideos', () => {
  it('renders a loading message while fetching videos', () => {
    const queryClient = new QueryClient();
    const store = createTestStore({ auth: { user: null }, theme: { theme: 'light' } });

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter>
            <GetAllVideos queryFn={() => Promise.resolve({ data: [] })} />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    expect(screen.getByText(/fetching videos/i)).toBeInTheDocument();
  });
});
