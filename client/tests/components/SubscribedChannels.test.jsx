import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import SubscribedChannels from '../../src/components/Channel/SubscribedChannels';
import createTestStore from '../store/testStore';

vi.mock('../../src/services/subscriptionService', () => ({
  getSubscribedChannels: vi.fn(() => Promise.resolve({ data: [] }))
}));

describe('SubscribedChannels', () => {
  it('renders the empty subscription state', async () => {
    const queryClient = new QueryClient();
    const store = createTestStore({ theme: { theme: 'light' } });

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter>
            <SubscribedChannels />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/no subscriptions yet/i)).toBeInTheDocument();
  });
});
