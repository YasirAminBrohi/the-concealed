import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { context } from '@devvit/web/server';
import { createPost, publishDailyPost } from '../core/post';

export const menu = new Hono();

menu.post('/post-create', async (c) => {
  try {
    const result = await createPost();

    if (result.success && result.postId) {
      return c.json<UiResponse>(
        {
          navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${result.postId}`,
          showToast: result.message,
        },
        200
      );
    }

    return c.json<UiResponse>(
      {
        showToast: result.message || 'Failed to create case post',
      },
      400
    );
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    return c.json<UiResponse>(
      {
        showToast: 'Failed to create post',
      },
      400
    );
  }
});

menu.post('/publish-daily', async (c) => {
  try {
    const result = await publishDailyPost();

    if (result.success && result.postId) {
      return c.json<UiResponse>(
        {
          navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${result.postId}`,
          showToast: result.message,
        },
        200
      );
    }

    return c.json<UiResponse>(
      {
        showToast: result.message,
      },
      200
    );
  } catch (error) {
    console.error(`Error in publish-daily menu: ${error}`);
    return c.json<UiResponse>(
      {
        showToast: 'Failed to publish daily mystery',
      },
      500
    );
  }
});
