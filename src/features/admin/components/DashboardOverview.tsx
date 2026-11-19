import Link from 'next/link';
import { ArrowRight, ShieldCheck, UserCheck, UserPlus, UsersRound } from 'lucide-react';

import { DsBox, DsButton, DsTypography } from '@/src/components';
import { ROUTES } from '@/src/constants';
import { DEMO_USERS } from '../data/demo-users';
import { formatDate, fullName } from '../utils';
import { RecentUsersTable } from './RecentUsersTable';
import { StatCard } from './StatCard';

const byNewest = [...DEMO_USERS].sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());
const latestMonth = byNewest[0]?.joinedAt.getMonth();

const stats = {
  total: DEMO_USERS.length,
  active: DEMO_USERS.filter((user) => user.status === 'active').length,
  newThisMonth: DEMO_USERS.filter((user) => user.joinedAt.getMonth() === latestMonth).length,
  admins: DEMO_USERS.filter((user) => user.role === 'admin').length,
};

const activity = byNewest.slice(0, 6).map((user, index) => ({
  id: user.id,
  text:
    index % 3 === 0
      ? `${fullName(user)} joined as ${user.role}`
      : index % 3 === 1
        ? `${fullName(user)} updated their profile`
        : `${fullName(user)} was invited`,
  date: formatDate(user.joinedAt),
}));

/** Dashboard body. Numbers come from demo data — swap for API queries. */
export function DashboardOverview() {
  return (
    <>
      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={stats.total} icon={UsersRound} change={12.5} hint="vs last month" />
        <StatCard label="Active users" value={stats.active} icon={UserCheck} change={4.1} hint="vs last month" />
        <StatCard label="New this month" value={stats.newThisMonth} icon={UserPlus} change={-2.3} hint="vs last month" />
        <StatCard label="Admins" value={stats.admins} icon={ShieldCheck} hint="with full access" />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <DsBox variant="card" padding="lg" shadow="sm" className="flex flex-col gap-4 xl:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <DsTypography variant="h4" as="h2">
                Recent users
              </DsTypography>
              <DsTypography variant="helperText">The latest people to join.</DsTypography>
            </div>
            <DsButton variant="ghost" size="sm" asChild>
              <Link href={ROUTES.ADMIN.USERS}>
                View all <ArrowRight className="rtl:rotate-180" />
              </Link>
            </DsButton>
          </div>
          <RecentUsersTable users={byNewest.slice(0, 5)} />
        </DsBox>

        <DsBox variant="card" padding="lg" shadow="sm" className="flex flex-col gap-4">
          <div>
            <DsTypography variant="h4" as="h2">
              Activity
            </DsTypography>
            <DsTypography variant="helperText">What happened recently.</DsTypography>
          </div>
          <ol className="flex flex-col">
            {activity.map((item, index) => (
              <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
                {index < activity.length - 1 && (
                  <span aria-hidden="true" className="absolute start-[5px] top-4 h-full w-px bg-border" />
                )}
                <span aria-hidden="true" className="mt-1.5 size-2.75 shrink-0 rounded-full border-2 border-primary bg-card" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-foreground">{item.text}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              </li>
            ))}
          </ol>
        </DsBox>
      </div>
    </>
  );
}
