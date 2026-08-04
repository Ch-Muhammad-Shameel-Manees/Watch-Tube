import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import SearchResults from '../../src/components/SearchResults';
import createTestStore from '../store/testStore';

vi.mock('../../src/services/searchService', () => ({
  searchResult: vi.fn(() => Promise.resolve({ data: { videos: [], users: [] } }))
}));

describe('SearchResults', () => {
  it('shows the empty-state copy when no query is present', () => {
    const queryClient = new QueryClient();
    const store = createTestStore({ theme: { theme: 'light' } });

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter initialEntries={['/search']}>
            <SearchResults />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    expect(screen.getByText(/search videos/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a search term/i)).toBeInTheDocument();
  });
});
