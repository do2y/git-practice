'use client';

import { useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserTopbar from '@/components/UserTopbar';
import EstimateForm from './EstimateForm';
import EstimateInfoPanel from './EstimateInfoPanel';
import EstimateItemTable from './EstimateItemTable';
import EstimatePreviewPanel from './EstimatePreviewPanel';
import { useEstimateState } from '@/hooks/useEstimateState';
import useUIStore from '@/store/uiStore';
import type { AuthUser } from '@/lib/types';

interface Props {
  user: AuthUser;
}

export default function EstimateClient({ user }: Props) {
  const setSelectedMenu = useUIStore((s) => s.setSelectedMenu);

  useEffect(() => {
    setSelectedMenu('견적서 작성');
    document.title = 'Smart WMS - 견적서 작성';
  }, [setSelectedMenu]);

  const state = useEstimateState();

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      <div className="dashboard-main">
        <UserTopbar user={user} />
        <main className="estimate-content">
          <EstimateInfoPanel state={state} />
          <div className="estimate-layout">
            <EstimateForm state={state} />
            <EstimateItemTable state={state} />
            <EstimatePreviewPanel state={state} />
          </div>
        </main>
      </div>
    </div>
  );
}
