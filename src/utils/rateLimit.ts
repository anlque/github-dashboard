export function formatRateLimitMessage(
  baseMessage: string,
  resetAt: number | null,
): string {
  const tokenHint =
    'Add GITHUB_TOKEN to a local .env file to raise limits (see .env.example).';

  if (!resetAt) {
    return `${baseMessage} ${tokenHint}`;
  }

  const retryTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(resetAt));

  return `${baseMessage} Rate limit resets around ${retryTime}. ${tokenHint}`;
}
