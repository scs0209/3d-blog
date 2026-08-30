'use client';

import { LoaderCircle, type LucideIcon } from 'lucide-react';
import Link, { useLinkStatus } from 'next/link';
import { type ComponentProps, forwardRef, useEffect } from 'react';
import { cn } from '@/shadcn-ui/lib/utils';
import { beginAdminNavPending, endAdminNavPending } from './admin-nav-pending';
import { adminTheme } from './admin-theme';

type AdminNavLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  iconOnly?: boolean;
} & Omit<ComponentProps<typeof Link>, 'href'>;

const AdminNavLinkStatus = ({
  icon: Icon,
  label,
  active,
  iconOnly,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  iconOnly?: boolean;
}) => {
  const { pending } = useLinkStatus();

  useEffect(() => {
    if (!pending) return;
    beginAdminNavPending();
    return () => {
      endAdminNavPending();
    };
  }, [pending]);

  if (iconOnly) {
    return (
      <>
        {pending ? (
          <LoaderCircle className='h-[22px] w-[22px] animate-spin' aria-hidden />
        ) : (
          <Icon className='h-[22px] w-[22px]' aria-hidden />
        )}
        <span className='sr-only'>
          {label}
          {pending ? ' 이동 중' : ''}
        </span>
      </>
    );
  }

  return (
    <>
      {pending ? (
        <LoaderCircle
          className={cn('h-[18px] w-[18px] shrink-0 animate-spin', active ? 'text-white' : 'text-white/70')}
          aria-hidden
        />
      ) : (
        <Icon
          className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-white' : 'text-white/55')}
          strokeWidth={1.75}
        />
      )}
      <span>{label}</span>
      {pending && <span className='sr-only'>페이지 이동 중</span>}
    </>
  );
};

export const AdminNavLink = forwardRef<HTMLAnchorElement, AdminNavLinkProps>(
  ({ href, label, icon, active, iconOnly, className, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        prefetch
        aria-current={active ? 'page' : undefined}
        aria-label={iconOnly ? label : undefined}
        className={cn(
          iconOnly
            ? cn(adminTheme.ornamentBtn, active && adminTheme.ornamentBtnActive)
            : cn(adminTheme.navBase, active && adminTheme.navActive),
          className,
        )}
        {...props}
      >
        <AdminNavLinkStatus icon={icon} label={label} active={active} iconOnly={iconOnly} />
      </Link>
    );
  },
);

AdminNavLink.displayName = 'AdminNavLink';
