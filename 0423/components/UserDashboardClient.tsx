'use client';

import AppErrorBoundary from '@/error/AppErrorBoundary';
import { useUserDashboardState } from '@/hooks/useUserDashboardState';
import type { AuthUser } from '@/lib/types';
import UserActionPanel from './UserActionPanel';
import UserInventoryTable from './UserInventoryTable';
import UserSidebar from './UserSidebar';
import UserSummarySection from './UserSummarySection';
import UserTopbar from './UserTopbar';

interface UserDashboardClientProps {
  user: AuthUser;
}

export default function UserDashboardClient({ user }: UserDashboardClientProps) {
  const {
    summaryCards,
    filteredInventoryRows,
    inventoryQuery,
    summaryQuery,
    requestMutation,
    inquiryMutation,
  } = useUserDashboardState();

  return (
    <div className="dashboard-layout">
      <UserSidebar />

      <div className="dashboard-main">
        <UserTopbar user={user} />

        <div className="dashboard-content">
          <UserActionPanel
            requestMutation={requestMutation}
            inquiryMutation={inquiryMutation}
          />

          <AppErrorBoundary>
            <UserSummarySection
              cards={summaryCards}
              isLoading={summaryQuery.isLoading}
              error={summaryQuery.error}
            />
          </AppErrorBoundary>

          <div className="status-panel">
            {inventoryQuery.isLoading && (
              <p className="status-text">Loading inventory...</p>
            )}
            {!inventoryQuery.isLoading && inventoryQuery.isFetching && (
              <p className="status-text">Refreshing the latest inventory data...</p>
            )}
            {inventoryQuery.error && (
              <p className="status-text error-text">{inventoryQuery.error.message}</p>
            )}
            {requestMutation.isPending && (
              <p className="status-text">Submitting the inbound request...</p>
            )}
            {requestMutation.isError && (
              <p className="status-text error-text">
                {requestMutation.error?.message}
              </p>
            )}
            {requestMutation.isSuccess && (
              <p className="status-text success-text">
                Inbound request submitted successfully.
              </p>
            )}
          </div>

          <AppErrorBoundary>
            <UserInventoryTable rows={filteredInventoryRows} />
          </AppErrorBoundary>
        </div>
      </div>
    </div>
  );
}
