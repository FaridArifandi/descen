/**
 * @deprecated - Supabase has been replaced with MySQL.
 * This file is kept temporarily as a stub to prevent import errors.
 * All new code should use '@/lib/db' (MySQL pool) or fetch('/api/...') instead.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// Dummy no-op client to prevent import errors during transition
const dummyFrom = () => ({
  select: (..._args: any[]) => ({ data: null, error: new Error('Supabase removed. Use MySQL API.'), order: (..._a: any[]) => ({ data: null, error: new Error('Supabase removed') }), eq: (..._a: any[]) => ({ data: null, error: new Error('Supabase removed'), single: () => ({ data: null, error: new Error('Supabase removed') }) }), single: () => ({ data: null, error: new Error('Supabase removed') }) }),
  insert: (..._args: any[]) => ({ data: null, error: new Error('Supabase removed'), select: () => ({ single: () => ({ data: null, error: new Error('Supabase removed') }) }), then: (cb: any) => cb({ error: new Error('Supabase removed') }) }),
  update: (..._args: any[]) => ({ data: null, error: new Error('Supabase removed'), eq: (..._a: any[]) => ({ data: null, error: new Error('Supabase removed'), then: (cb: any) => cb({ error: new Error('Supabase removed') }) }), then: (cb: any) => cb({ error: new Error('Supabase removed') }) }),
  delete: () => ({ data: null, error: new Error('Supabase removed'), eq: (..._a: any[]) => ({ data: null, error: new Error('Supabase removed'), then: (cb: any) => cb({ error: new Error('Supabase removed') }) }), then: (cb: any) => cb({ error: new Error('Supabase removed') }) }),
  upsert: (..._args: any[]) => ({ data: null, error: new Error('Supabase removed'), select: () => ({ single: () => ({ data: null, error: new Error('Supabase removed') }) }), then: (cb: any) => cb({ error: new Error('Supabase removed') }) }),
});

const dummyClient = {
  from: dummyFrom,
  storage: {
    from: () => ({
      upload: () => ({ data: null, error: new Error('Supabase removed') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

export const supabase = dummyClient as any;
