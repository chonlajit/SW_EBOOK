import React from 'react';
import { OrderStatus } from '@/lib/types';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: Props) {
  if (status === 'PAID') {
    return (
      <span className="badge badge-paid">
        <CheckCircle2 size={14} style={{ marginRight: '4px' }} />
        ชำระเงินแล้ว (PAID)
      </span>
    );
  }

  if (status === 'PENDING') {
    return (
      <span className="badge badge-pending">
        <Clock size={14} style={{ marginRight: '4px' }} />
        รอชำระเงิน (PENDING)
      </span>
    );
  }

  return (
    <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
      <XCircle size={14} style={{ marginRight: '4px' }} />
      ยกเลิก ({status})
    </span>
  );
}
