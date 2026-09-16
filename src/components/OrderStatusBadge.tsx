import React from 'react';
import { OrderStatus } from '@/lib/types';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: Props) {
  if (status === 'PAID') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          backgroundColor: '#1C3002',
          color: '#E9FFB6',
          border: '1.5px solid #000000',
          borderRadius: '4px',
          fontFamily: 'var(--font-ubuntu-mono), monospace',
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
        }}
      >
        <CheckCircle2 size={14} />
        <span>ชำระเงินแล้ว (PAID)</span>
      </span>
    );
  }

  if (status === 'PENDING') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          backgroundColor: '#E9FFB6',
          color: '#1C3002',
          border: '1.5px solid #000000',
          borderRadius: '4px',
          fontFamily: 'var(--font-ubuntu-mono), monospace',
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
        }}
      >
        <Clock size={14} />
        <span>รอชำระเงิน (PENDING)</span>
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        backgroundColor: '#FFDED9',
        color: '#000000',
        border: '1.5px solid #000000',
        borderRadius: '4px',
        fontFamily: 'var(--font-ubuntu-mono), monospace',
        fontSize: '0.82rem',
        fontWeight: 700,
        letterSpacing: '0.5px',
      }}
    >
      <XCircle size={14} />
      <span>ยกเลิก ({status})</span>
    </span>
  );
}
