import { reddit, redis } from '@devvit/web/server';
import { CASE_LIBRARY, getTodayPakistanDate, getCaseForDate } from '../services/caseLibrary';
import { setCaseIdForPost, RedisKeys } from '../services/redisStore';

export const publishDailyPost = async (
  targetCaseId?: string
): Promise<{ success: boolean; postId?: string; message: string }> => {
  const dateStr = getTodayPakistanDate();
  const caseData = targetCaseId ? CASE_LIBRARY[targetCaseId] : getCaseForDate(dateStr);

  if (!caseData) {
    return { success: false, message: `No valid case found for date ${dateStr}.` };
  }

  // Idempotency check: if not forcing a specific case, verify today's post hasn't been created yet
  if (!targetCaseId) {
    const existingPostId = await redis.get(RedisKeys.dailyPost(dateStr));
    if (existingPostId) {
      return {
        success: true,
        postId: existingPostId,
        message: `Daily case for ${dateStr} already published (Post ID: ${existingPostId}).`,
      };
    }
  }

  try {
    const title = `THE UNSEEN: ${caseData.caseNumber} — ${caseData.title} [Daily Detective Mystery]`;
    const post = await reddit.submitCustomPost({
      title,
    });

    // Permanently link the Reddit post ID to this case ID
    await setCaseIdForPost(post.id, caseData.id);

    // Save daily post record
    await redis.set(RedisKeys.dailyPost(dateStr), post.id);

    console.log(`[THE UNSEEN] Published daily case ${caseData.caseNumber} as post ${post.id}`);
    return {
      success: true,
      postId: post.id,
      message: `Successfully published ${caseData.caseNumber} (Post ID: ${post.id})`,
    };
  } catch (error) {
    console.error('[THE UNSEEN] Error publishing daily custom post:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error publishing post',
    };
  }
};

export const createPost = async () => {
  return await publishDailyPost('case-001');
};
