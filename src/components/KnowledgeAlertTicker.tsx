'use client';

import React from 'react';

export default function KnowledgeAlertTicker() {
  return (
    <div
      className="figma-bg-pink-dots"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        zIndex: 10,
        pointerEvents: 'none',
        lineHeight: 0,
        fontSize: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <img
        src="/figma/knowledge-alert.svg"
        alt="Knowledge Alert Ribbon"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
}
