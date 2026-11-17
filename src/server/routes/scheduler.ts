import { Hono } from 'hono';
import { publishDailyPost } from '../core/post';
import { getTodayPakistanDate } from '../services/caseLibrary';

export const scheduler = new Hono();

scheduler.post('/daily-publish', async (c) => {
  const pktDate = getTodayPakistanDate();
  console.log(`[THE UNSEEN SCHEDULER] Triggered 05:05 AM PKT daily publish job for date ${pktDate}`);

  try {
    const result = await publishDailyPost();
    if (result.success) {
      return c.json({
        success: true,
        date: pktDate,
        postId: result.postId,
        message: result.message,
      });
    } else {
      console.warn(`[THE UNSEEN SCHEDULER] Daily publishing warning: ${result.message}`);
      return c.json({ success: false, error: result.message }, 500);
    }
  } catch (err) {
    console.error('[THE UNSEEN SCHEDULER] Exception during daily publishing:', err);
    return c.json({ success: false, error: String(err) }, 500);
  }
});
