import { z } from 'zod';
import { calculatorSchema } from './schema';

// No backend API needed for a client-side calculator, 
// but defining the structure for consistency.

export const api = {
  // Empty as we don't have server-side calculation requirements
  // Everything is done client-side for immediate feedback
};

// ============================================
// REQUIRED: buildUrl helper — frontend imports this!
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
