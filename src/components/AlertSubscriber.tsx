'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { API_BASE } from '@/service/baseAPI';

interface AlertData {
  stockAlertId: number;
  stockSymbol: string;
  targetPrice: number;
  above: boolean;
}

export default function AlertSubscriber() {
  const [notifications, setNotifications] = useState<AlertData[]>([]);

  useEffect(() => {
    let es: EventSourcePolyfill;

    async function subscribeIfAlertsExist() {
      const supabase = createClient();
      const session = await getSessionOrThrow(supabase);
      const token = session.access_token;

      // 1. 알림 존재 여부 확인 (GET /alerts)
      const res = await fetch(`${API_BASE}/alerts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error('알림 확인 실패');
        return;
      }

      const data = await res.json();
      const alerts = data.responses ?? [];

      if (alerts.length === 0) {
        console.log('등록된 알림 없음: SSE 미연결');
        return;
      }

      // 2. 알림 존재 → SSE 연결
      es = new EventSourcePolyfill(`${API_BASE}/alerts/subscribe`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      es.onmessage = (e) => {
        try {
          const data: AlertData = JSON.parse(e.data);
          setNotifications((prev) => [data, ...prev]);
        } catch {
          console.error('Invalid SSE data', e.data);
        }
      };

      es.onerror = (err) => {
        console.error('SSE error', err);
        es.close();
      };
    }

    subscribeIfAlertsExist();

    return () => {
      es?.close();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((n) => (
        <div
          key={n.stockAlertId}
          className="bg-white text-black p-3 rounded shadow-lg max-w-xs"
        >
          <strong>{n.stockSymbol}</strong>이{' '}
          <strong>{n.targetPrice.toLocaleString()}원</strong>{' '}
          {n.above ? '이상' : '이하'} 도달!
        </div>
      ))}
    </div>
  );
}
