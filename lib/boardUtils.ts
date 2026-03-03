export const TRIAL_THRESHOLD_THREADS = 5;
export const TRIAL_THRESHOLD_POSTS   = 20;
export const TRIAL_THRESHOLD_SCORE   = 35;
export const TRIAL_DAYS              = 7;
export const INACTIVE_DAYS           = 30;

export function calculateScore(threadCount: number, postCount: number): number {
  return threadCount * 3 + postCount * 1;
}

export function shouldPromote(threadCount: number, postCount: number): boolean {
  const score = calculateScore(threadCount, postCount);
  return (
    threadCount >= TRIAL_THRESHOLD_THREADS ||
    postCount   >= TRIAL_THRESHOLD_POSTS   ||
    score       >= TRIAL_THRESHOLD_SCORE
  );
}