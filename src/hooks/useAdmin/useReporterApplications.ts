// File: src/hooks/useAdmin/useReporterApplications.ts
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  fetchReporterApplications,
  patchReporterApplications,
} from '@/service/reporterApplicationsService';

export interface ApplicationResponse {
  applicationId: number;
  userId: string;
  fullname: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  processedAt: string | null;
}

export function useReporterApplications() {
  const didFetch = useRef(false);
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'REJECTED'>('ALL');

  const loadApps = async () => {
    try {
      const data = await fetchReporterApplications();
      setApps(data);
    } catch (err) {
      console.error(err);
    }
  };

  const processApps = async (action: 'APPROVED' | 'REJECTED') => {
    if (!selected.length) return;
    try {
      await patchReporterApplications(selected, action);
      loadApps();
      setSelected([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    loadApps();
  }, []);

  const toggleSelect = (id: number) => {
    const app = apps.find((a) => a.applicationId === id);
    if (app?.status === 'REJECTED') return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const selectable = apps
      .filter((a) => a.status !== 'REJECTED')
      .map((a) => a.applicationId);
    if (selected.length === selectable.length) {
      setSelected([]);
    } else {
      setSelected(selectable);
    }
  };

  const filteredApps = apps.filter((app) => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  return {
    apps,
    selected,
    filter,
    setFilter,
    toggleSelect,
    toggleAll,
    processApps,
    filteredApps,
  };
}
