import { describe, expect, it, vi } from 'vitest';
import { createAppRouter, mountApp } from '../../src/main';

describe('main entrypoint', () => {
  it('creates a router with the expected routes', () => {
    const router = createAppRouter();
    const routePaths = router.routes.flatMap((route) => [route.path, ...(route.children ?? []).map((child) => child.path)]);

    expect(routePaths).toContain('/login');
    expect(routePaths).toContain('register');
    expect(routePaths).toContain(undefined);
  });

  it('mounts the app into the root container', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const rootElement = mountApp();

    expect(rootElement).toBe(document.getElementById('root'));
  });
});
