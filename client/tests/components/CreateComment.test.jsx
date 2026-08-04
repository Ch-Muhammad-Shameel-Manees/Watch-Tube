import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateComment from '../../src/components/Video/CreateComment';
import createTestStore from '../store/testStore';

vi.mock('../../src/services/commentSevice.js', () => ({
  createComment: vi.fn(),
  createReply: vi.fn()
}));

import { createComment, createReply } from '../../src/services/commentSevice.js';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderCreateComment(props = {}) {
  const queryClient = new QueryClient();
  const store = createTestStore({
    theme: {
      theme: 'light'
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <CreateComment videoId="video-1" {...props} />
      </Provider>
    </QueryClientProvider>
  );
}

describe('CreateComment', () => {
  it('shows validation error and does not call the service when the content is empty', async () => {
    const user = userEvent.setup();

    renderCreateComment();

    await user.click(screen.getByRole('button', { name: /comment/i }));

    expect(await screen.findByText(/comment content is required/i)).toBeInTheDocument();
    expect(createComment).not.toHaveBeenCalled();
    expect(createReply).not.toHaveBeenCalled();
  });

  it('creates a comment when the user enters content', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    createComment.mockResolvedValue({ success: true });

    renderCreateComment({ onSuccess });

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    await user.type(textarea, 'This is a great video');
    await user.click(screen.getByRole('button', { name: /comment/i }));

    expect(createComment).toHaveBeenCalledWith('video-1', { content: 'This is a great video' });
    expect(onSuccess).toHaveBeenCalled();
    expect(textarea).toHaveValue('');
  });

  it('creates a reply when a parent comment id is provided', async () => {
    const user = userEvent.setup();
    createReply.mockResolvedValue({ success: true });

    renderCreateComment({ parentCommentId: 'comment-1', buttonText: 'Reply' });

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    await user.type(textarea, 'Thanks for sharing');
    await user.click(screen.getByRole('button', { name: /reply/i }));

    expect(createReply).toHaveBeenCalledWith('comment-1', { content: 'Thanks for sharing' });
    expect(createComment).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('');
  });
});
