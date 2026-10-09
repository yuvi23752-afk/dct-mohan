import { describe, expect, it } from 'vitest';
import { getNavigationByProfile } from './sidebar';

describe('getNavigationByProfile', () => {
  it('does not grant all CRM modules to an admin profile without matching effective permissions', () => {
    const nav = getNavigationByProfile('Sales Executive', [], () => false, false, true);

    expect(nav.some((item) => item.href === '/setup')).toBe(true);
    expect(nav.some((item) => item.href === '/leads')).toBe(false);
    expect(nav.some((item) => item.href === '/bookings')).toBe(false);
    expect(nav.some((item) => item.href === '/reports')).toBe(false);
  });

  it('grants module access only when the required effective permission exists', () => {
    const nav = getNavigationByProfile('Sales Executive', [], (perm) => perm === 'LEAD_READ' || perm === 'REPORT_VIEW', false, false);

    expect(nav.some((item) => item.href === '/leads')).toBe(true);
    expect(nav.some((item) => item.href === '/reports')).toBe(true);
    expect(nav.some((item) => item.href === '/opportunities')).toBe(false);
  });
});

describe('role-based sidebar matrix', () => {
  const withPerms = (...perms: string[]) => (perm: string) => perms.includes(perm);

  const presalesPerms = ['LEAD_READ', 'SITE_VISIT_READ', 'DASHBOARD_READ'];
  const salesPerms = [
    'LEAD_READ', 'SITE_VISIT_READ', 'DASHBOARD_READ',
    'OPPORTUNITY_READ', 'QUOTATION_READ', 'BOOKING_READ', 'PAYMENT_READ', 'PROJECT_READ',
  ];
  const crmPerms = [
    'LEAD_READ', 'SITE_VISIT_READ', 'DASHBOARD_READ',
    'OPPORTUNITY_READ', 'QUOTATION_READ', 'BOOKING_READ', 'PAYMENT_READ',
    'PROJECT_READ', 'TASK_READ',
  ];
  const allPerms = [
    'LEAD_READ', 'SITE_VISIT_READ', 'OPPORTUNITY_READ', 'QUOTATION_READ',
    'BOOKING_READ', 'PAYMENT_READ', 'PROJECT_READ', 'TASK_READ', 'REPORT_VIEW',
  ];

  it('Presales sees only Home, Leads, Site Visits', () => {
    const nav = getNavigationByProfile('Presales', [], withPerms(...presalesPerms), false, false);
    expect(nav.map((item) => item.title)).toEqual(['Home', 'Leads', 'Site Visits']);
  });

  it('SVC sees only Home, Leads, Site Visits', () => {
    const nav = getNavigationByProfile('SVC', [], withPerms(...presalesPerms), false, false);
    expect(nav.map((item) => item.title)).toEqual(['Home', 'Leads', 'Site Visits']);
  });

  it('Sales sees Leads, Site Visits, Opportunities, Quotations, Bookings, Payments without Projects, Tasks, Reports', () => {
    const nav = getNavigationByProfile('Sales', [], withPerms(...salesPerms), false, false);
    expect(nav.map((item) => item.title)).toEqual([
      'Home', 'Leads', 'Site Visits', 'Opportunities', 'Quotations', 'Bookings', 'Payments',
    ]);
  });

  it('CRM sees the Sales modules plus Projects and Tasks, without Reports', () => {
    const nav = getNavigationByProfile('CRM', [], withPerms(...crmPerms), false, false);
    expect(nav.map((item) => item.title)).toEqual([
      'Home', 'Leads', 'Site Visits', 'Opportunities', 'Quotations', 'Bookings', 'Payments',
      'Projects', 'Tasks',
    ]);
  });

  it('Admin sees every module plus Setup Home', () => {
    const nav = getNavigationByProfile('Admin', [], withPerms(...allPerms), false, true);
    expect(nav.map((item) => item.title)).toEqual([
      'Home', 'Leads', 'Site Visits', 'Opportunities', 'Quotations', 'Bookings', 'Payments',
      'Projects', 'Tasks', 'Reports', 'Setup Home',
    ]);
  });

  it('Superadmin sees Companies and every module plus Setup Home', () => {
    const nav = getNavigationByProfile(undefined, [], withPerms(...allPerms), true, true);
    expect(nav.map((item) => item.title)).toEqual([
      'Home', 'Companies', 'Leads', 'Site Visits', 'Opportunities', 'Quotations', 'Bookings',
      'Payments', 'Projects', 'Tasks', 'Reports', 'Setup Home',
    ]);
  });
});
