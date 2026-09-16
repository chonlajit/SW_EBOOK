'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogIn, CheckCircle2, AlertCircle, Key, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, quickLoginAs } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // If already logged in
  if (user && !success) {
    return (
      <div
        className="figma-bg-pink-dots"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1rem',
          minHeight: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '8px solid #E9FFB6',
            borderRadius: '4px',
            padding: '2.5rem 2rem',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          }}
        >
          <CheckCircle2 size={48} color="#1C3002" style={{ margin: '0 auto 1rem auto' }} />
          <h2
            style={{
              fontFamily: "var(--font-victory), sans-serif",
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#000000',
              marginBottom: '0.5rem',
            }}
          >
            คุณอยู่ในระบบแล้ว
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              color: '#5E6C4B',
              fontSize: '0.95rem',
              marginBottom: '1.5rem',
            }}
          >
            เข้าสู่ระบบในชื่อ <strong style={{ color: '#000000' }}>{user.name}</strong> ({user.email})
          </p>
          <Link
            href="/"
            style={{
              display: 'block',
              width: '100%',
              padding: '0.85rem',
              backgroundColor: '#1C3002',
              color: '#E9FFB6',
              border: '2px solid #000000',
              borderRadius: '4px',
              fontFamily: "var(--font-victory), sans-serif",
              fontWeight: 900,
              fontSize: '1.1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }}
          >
            ไปที่หน้าร้าน (GO TO STORE)
          </Link>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('กรุณากรอก Username หรือ Email');
      return;
    }

    if (!password) {
      setErrorMsg('กรุณากรอกรหัสผ่าน');
      return;
    }

    setSubmitting(true);
    const res = await login(identifier.trim(), password);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setErrorMsg(res.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'user') => {
    setSubmitting(true);
    setErrorMsg('');
    await quickLoginAs(role);
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <div
      className="figma-bg-pink-dots"
      style={{
        flex: 1,
        padding: '3.5rem 1rem 5rem 1rem',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '480px', width: '100%' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '8px solid #E9FFB6',
            borderRadius: '4px',
            padding: '2.5rem 2rem',
            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-block',
                background: '#000000',
                color: '#E9FFB6',
                padding: '3px 10px',
                borderRadius: '3px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontWeight: 700,
                letterSpacing: '1px',
                marginBottom: '0.5rem',
              }}
            >
              // ACCESS CONTROL TERMINAL
            </div>

            <h1
              style={{
                fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
                fontSize: '2.8rem',
                fontWeight: 900,
                color: '#000000',
                letterSpacing: '-1px',
                lineHeight: 1,
                margin: '0.25rem 0',
              }}
            >
              SIGN IN
            </h1>
            <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B', marginTop: '0.35rem' }}>
              เข้าสู่ระบบเพื่อเข้าถึงบัญชีผู้ใช้และจัดการข้อมูล
            </p>
          </div>

          {/* Success Banner */}
          {success && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#E9FFB6',
                border: '2px solid #000000',
                borderRadius: '4px',
                color: '#1C3002',
                marginBottom: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={18} />
              <span>เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#FFDED9',
                border: '2px solid #000000',
                borderRadius: '4px',
                color: '#000000',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.4rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '0.4rem',
                }}
              >
                Username หรือ Email <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น admin หรือ user@cjshop.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={submitting || success}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.95rem',
                  color: '#000000',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '0.4rem',
                }}
              >
                รหัสผ่าน (Password) <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting || success}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.95rem',
                  color: '#000000',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || success}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                backgroundColor: '#1C3002',
                color: '#E9FFB6',
                border: '2px solid #000000',
                borderRadius: '4px',
                fontFamily: "var(--font-victory), sans-serif",
                fontSize: '1.2rem',
                fontWeight: 900,
                letterSpacing: '0.5px',
                cursor: submitting ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !submitting && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span>{submitting ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ (LOGIN)'}</span>
              <LogIn size={18} />
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1.25rem',
              backgroundColor: '#FFDED9',
              borderRadius: '4px',
              border: '2px solid #000000',
            }}
          >
            <div
              style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-ubuntu-mono), monospace',
                fontWeight: 700,
                color: '#000000',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Key size={14} color="#1C3002" />
              <span>DEMO QUICK LOGIN (สำหรับทดสอบระบบ)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('user')}
                disabled={submitting || success}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: '#1C3002',
                  color: '#E9FFB6',
                  border: '1.5px solid #000000',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>👤 ล็อกอินด่วน: ผู้ใช้ทั่วไป (cjuser)</span>
                <span style={{ fontSize: '0.75rem', color: '#E9FFB6' }}>cjuser / user123</span>
              </button>
            </div>
          </div>

          {/* Footer Link to Register */}
          <div
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              color: '#000000',
            }}
          >
            <span>ยังไม่มีบัญชีผู้ใช้งาน? </span>
            <Link
              href="/register"
              style={{
                color: '#1C3002',
                fontWeight: 900,
                textDecoration: 'underline',
              }}
            >
              สมัครสมาชิกที่นี่ (REGISTER)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
