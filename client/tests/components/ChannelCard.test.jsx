import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ChannelCard from '../../src/components/Channel/ChannelCard';
import createTestStore from '../store/testStore';

describe('ChannelCard', () => {
  it('renders the channel username and avatar', () => {
    const store = createTestStore({ theme: { theme: 'light' } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ChannelCard channel={{ username: 'shameel', avatar: 'avatar.png' }} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('shameel')).toBeInTheDocument();
    expect(screen.getByAltText('Avatar')).toBeInTheDocument();
  });
});
