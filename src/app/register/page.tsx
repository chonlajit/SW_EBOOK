'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail, isValidUsername } from '@/lib/authStore';
import { CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Field errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // If already logged in, show redirect notice
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
            คุณเข้าสู่ระบบอยู่แล้ว
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              color: '#5E6C4B',
              fontSize: '0.95rem',
              marginBottom: '1.5rem',
            }}
          >
            เข้าใช้งานในชื่อ <strong style={{ color: '#000000' }}>{user.name}</strong> ({user.email})
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
            กลับสู่หน้าร้าน (STORE)
          </Link>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!username.trim()) {
      errs.username = 'กรุณากรอก Username';
    } else if (!isValidUsername(username)) {
      errs.username = 'Username ต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลข 3-24 ตัวอักษร';
    }

    if (!name.trim()) {
      errs.name = 'กรุณากรอกชื่อ-นามสกุล';
    } else if (name.trim().length < 2) {
      errs.name = 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร';
    }

    if (!email.trim()) {
      errs.email = 'กรุณากรอกอีเมล';
    } else if (!isValidEmail(email)) {
      errs.email = 'รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: user@domain.com)';
    }

    if (!password) {
      errs.password = 'กรุณากรอกรหัสผ่าน';
    } else if (password.length < 6) {
      errs.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'รหัสผ่านยืนยันไม่ตรงกัน';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setSubmitting(true);
    const res = await register({
      username: username.trim().toLowerCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      setGeneralError(res.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    }
  };

  return (
    <div
      className="figma-bg-pink-dots"
      style={{
        flex: 1,
        padding: '3rem 1rem 5rem 1rem',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '520px', width: '100%' }}>
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
              // AUTH SYSTEM REGISTRATION
            </div>

            <h1
              style={{
                fontFamily: "var(--font-milker), 'Montserrat', sans-serif",
                fontSize: '2.6rem',
                fontWeight: 900,
                color: '#000000',
                letterSpacing: '-1px',
                lineHeight: 1,
                margin: '0.25rem 0',
              }}
            >
              CREATE ACCOUNT
            </h1>
            <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-ubuntu-mono), monospace', color: '#5E6C4B', marginTop: '0.35rem' }}>
              สมัครสมาชิกเพื่อสั่งซื้อและดาวน์โหลด E-book ได้ทันที
            </p>
          </div>

          {/* Role Policy Notice */}
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#FFDED9',
              border: '2px solid #000000',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              color: '#000000',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <Shield size={18} color="#1C3002" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#1C3002' }}>ระดับสิทธิ์ (Role: USER):</strong>{' '}
              การสมัครหน้าเว็บจะได้รับสิทธิ์เป็นผู้ใช้ทั่วไปเสมอ สิทธิ์ Admin ต้องได้รับการแต่งตั้งโดย Admin ในระบบ
            </div>
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
              <CheckCircle2 size={20} />
              <span>สมัครสมาชิกสำเร็จ! กำลังพาท่านกลับสู่หน้าหลัก...</span>
            </div>
          )}

          {/* General Error Banner */}
          {generalError && (
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
              <span>{generalError}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontFamily: 'var(--font-ubuntu-mono), monospace', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                Username (ชื่อผู้ใช้สำหรับล็อกอิน) <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น codewarrior, alex_dev"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
                }}
                disabled={submitting || success}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: `2px solid ${errors.username ? '#1C3002' : '#000000'}`,
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.95rem',
                  color: '#000000',
                  outline: 'none',
                }}
              />
              {errors.username && (
                <div style={{ color: '#1C3002', fontFamily: 'var(--font-ubuntu-mono), monospace', fontSize: '0.78rem', marginTop: '4px', fontWeight: 700 }}>
                  {errors.username}
                </div>
              )}
            </div>

            {/* Display Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontFamily: 'var(--font-ubuntu-mono), monospace', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                ชื่อ-นามสกุล หรือ Display Name <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น สมชาย สายโค้ด"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                disabled={submitting || success}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: `2px solid ${errors.name ? '#1C3002' : '#000000'}`,
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.95rem',
                  color: '#000000',
                  outline: 'none',
                }}
              />
              {errors.name && (
                <div style={{ color: '#1C3002', fontFamily: 'var(--font-ubuntu-mono), monospace', fontSize: '0.78rem', marginTop: '4px', fontWeight: 700 }}>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontFamily: 'var(--font-ubuntu-mono), monospace', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                อีเมล (Email Address) <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                disabled={submitting || success}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: `2px solid ${errors.email ? '#1C3002' : '#000000'}`,
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.95rem',
                  color: '#000000',
                  outline: 'none',
                }}
              />
              {errors.email && (
                <div style={{ color: '#1C3002', fontFamily: 'var(--font-ubuntu-mono), monospace', fontSize: '0.78rem', marginTop: '4px', fontWeight: 700 }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontFamily: 'var(--font-ubuntu-mono), monospace', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                disabled={submitting || success}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: `2px solid ${errors.password ? '#1C3002' : '#000000'}`,
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.95rem',
                  color: '#000000',
                  outline: 'none',
                }}
              />
              {errors.password && (
                <div style={{ color: '#1C3002', fontFamily: 'var(--font-ubuntu-mono), monospace', fontSize: '0.78rem', marginTop: '4px', fontWeight: 700 }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontFamily: 'var(--font-ubuntu-mono), monospace', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                ยืนยันรหัสผ่านอีกครั้ง <span style={{ color: '#1C3002', fontWeight: 900 }}>*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                disabled={submitting || success}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: `2px solid ${errors.confirmPassword ? '#1C3002' : '#000000'}`,
                  borderRadius: '4px',
                  fontFamily: 'var(--font-ubuntu-mono), monospace',
                  fontSize: '0.95rem',
                  color: '#000000',
                  outline: 'none',
                }}
              />
              {errors.confirmPassword && (
                <div style={{ color: '#1C3002', fontFamily: 'var(--font-ubuntu-mono), monospace', fontSize: '0.78rem', marginTop: '4px', fontWeight: 700 }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Submit Button */}
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
              <span>{submitting ? 'กำลังบันทึกข้อมูล...' : 'สมัครสมาชิก (REGISTER)'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Link to Login */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '2px dashed #000000',
              textAlign: 'center',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-ubuntu-mono), monospace',
              color: '#000000',
            }}
          >
            <span>มีบัญชีผู้ใช้งานอยู่แล้ว? </span>
            <Link
              href="/login"
              style={{
                color: '#1C3002',
                fontWeight: 900,
                textDecoration: 'underline',
              }}
            >
              เข้าสู่ระบบที่นี่ (LOGIN)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
