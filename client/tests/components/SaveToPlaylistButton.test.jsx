import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SaveToPlaylistButton from '../../src/components/Playlist/SaveToPlaylistButton';

describe('SaveToPlaylistButton', () => {
  it('renders the playlist toggle button', () => {
    render(<SaveToPlaylistButton videoId="video-1" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
