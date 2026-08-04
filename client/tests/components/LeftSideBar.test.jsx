import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import LeftSideBar from '../../src/components/Layout/LeftSideBar';
import createTestStore from '../store/testStore';

describe('LeftSideBar', () => {
  it('renders the navigation links for signed-in and signed-out users', () => {
    const store = createTestStore({
      auth: { authStatus: false, user: null },
      theme: { theme: 'light' }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LeftSideBar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Playlists')).toBeInTheDocument();
  });
});
