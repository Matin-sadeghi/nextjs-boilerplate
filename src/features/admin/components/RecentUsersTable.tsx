'use client';
import { createDsColumnHelper, DsDataTable } from '@/src/components';
import type { AdminUser } from '../types';
import { formatDate } from '../utils';
import { UserCell, UserRoleBadge, UserStatusBadge } from './UserBadges';

const col = createDsColumnHelper<AdminUser>();
const columns = col.columns([
  col.display({ id: 'user', header: 'User', cell: ({ row }) => <UserCell user={row.original} /> }),
  col.accessor('role', { header: 'Role', enableSorting: false, cell: ({ getValue }) => <UserRoleBadge role={getValue()} /> }),
  col.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => <UserStatusBadge status={getValue()} />,
  }),
  col.accessor('joinedAt', {
    header: 'Joined',
    enableSorting: false,
    meta: { align: 'end' },
    cell: ({ getValue }) => <span className="text-muted-foreground">{formatDate(getValue())}</span>,
  }),
]);

export function RecentUsersTable({ users }: { users: AdminUser[] }) {
  return <DsDataTable columns={columns} data={users} getRowId={(user) => user.id} paginated={false} />;
}
