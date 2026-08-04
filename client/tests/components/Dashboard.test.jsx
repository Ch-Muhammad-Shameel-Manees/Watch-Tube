import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Dashboard from '../../src/components/Dashboard';

vi.mock('../../src/components/Video', () => ({
  GetAllVideos: ({ queryFn }) => <div data-testid="get-all-videos">{queryFn ? 'videos loaded' : 'missing query fn'}</div>
}));

describe('Dashboard', () => {
  it('renders the video list with the video service query', () => {
    render(<Dashboard />);

    expect(screen.getByTestId('get-all-videos')).toHaveTextContent('videos loaded');
  });
});
