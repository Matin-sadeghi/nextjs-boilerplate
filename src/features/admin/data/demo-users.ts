import type { AdminUser, AdminUserRole, AdminUserStatus } from '../types';

/**
 * Demo data so the panel works without a backend.
 * Replace with an API call + React Query hook (see `features/health/hooks`).
 */
const firstNames = ['Ada', 'Alan', 'Grace', 'Linus', 'Margaret', 'Dennis', 'Barbara', 'Ken', 'Radia', 'Tim', 'Frances', 'Guido'];
const lastNames = ['Lovelace', 'Turing', 'Hopper', 'Torvalds', 'Hamilton', 'Ritchie', 'Liskov', 'Thompson', 'Perlman', 'Berners-Lee', 'Allen', 'van Rossum'];
const roles: AdminUserRole[] = ['admin', 'editor', 'viewer', 'viewer', 'editor'];
const statuses: AdminUserStatus[] = ['active', 'active', 'active', 'invited', 'suspended'];

export const DEMO_USERS: AdminUser[] = Array.from({ length: 42 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[(i * 5) % lastNames.length];
  return {
    id: `usr_${String(i + 1).padStart(3, '0')}`,
    firstName,
    lastName,
    email: `${firstName}.${lastName}${i}`.toLowerCase().replace(/[^a-z0-9.]/g, '') + '@example.com',
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    // Fixed dates (no `new Date()`), so prerendering stays deterministic.
    joinedAt: new Date(2026, 10 - Math.floor(i / 4), 28 - ((i * 3) % 27)),
  };
});
