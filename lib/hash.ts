import { createHash } from 'crypto';

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export function hashIP(ip: string): string {
  return sha256(ip + (process.env.IP_SALT || 'default_salt'));
}

export function getAnonId(ip: string, threadId: string): string {
  return sha256(ip + threadId).slice(0, 6);
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  return (forwarded?.split(',')[0] || real || '127.0.0.1').trim();
}