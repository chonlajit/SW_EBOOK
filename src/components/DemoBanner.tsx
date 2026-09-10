import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="demo-banner-futuristic" role="alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <strong>DEMO ONLY</strong>
        <span style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>
          ระบบจำลองการสั่งซื้อเพื่อการศึกษา (Mock Payment) • ไม่มีการเรียกเก็บเงินจริง
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
        <span className="red-pin"></span>
        <span>SYS.STATUS: ONLINE</span>
      </div>
    </div>
  );
}
