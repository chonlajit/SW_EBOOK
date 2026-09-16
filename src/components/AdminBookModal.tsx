'use client';

import React, { useState, useRef } from 'react';
import { useBooks } from '@/context/BooksContext';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Plus,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Image as ImageIcon,
  Upload,
  FileText,
  Link2,
  FolderOpen,
  Check,
  Pencil
} from 'lucide-react';
import { Book } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialBookToEdit?: Book | null;
}

const PRESET_COVERS = [
  { name: 'ปก AI Vibe', url: '/covers/book1.svg' },
  { name: 'ปก Next.js & Supabase', url: '/covers/book2.svg' },
  { name: 'ปก Mobile App', url: '/covers/book3.svg' },
  { name: 'ปก Custom Cloud', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60' },
  { name: 'ปก Cyber Code', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60' },
];

export default function AdminBookModal({ isOpen, onClose, initialBookToEdit }: Props) {
  const { books, addBook, updateBook, deleteBook, resetBooks } = useBooks();
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [coverUrl, setCoverUrl] = useState('/covers/book1.svg');
  const [tags, setTags] = useState('AI, Programming');
  const [pages, setPages] = useState('200');
  const [filePath, setFilePath] = useState('sample-vibe-coding.pdf');

  // Cover image mode: 'upload' (local file) vs 'url' (direct link/preset)
  const [coverMode, setCoverMode] = useState<'upload' | 'url'>('upload');
  const [coverFileName, setCoverFileName] = useState('');
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // E-book file mode: 'upload' (local file) vs 'url' (path / link)
  const [fileMode, setFileMode] = useState<'upload' | 'url'>('upload');
  const [ebookFileName, setEbookFileName] = useState('');
  const [ebookFileSize, setEbookFileSize] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const ebookInputRef = useRef<HTMLInputElement>(null);

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const startEditing = (book: Book) => {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setPrice(String(book.price));
    setCoverUrl(book.cover_url);
    setTags(book.tags?.join(', ') || 'AI, Programming');
    setPages(String(book.pages || 200));
    setFilePath(book.file_path);
    setCoverFileName('');
    setEbookFileName('');
    setCoverMode('url');
    setFileMode('url');
    setActiveTab('add');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const cancelEditing = () => {
    setEditingBookId(null);
    setTitle('');
    setAuthor('');
    setDescription('');
    setPrice('');
    setCoverUrl('/covers/book1.svg');
    setCoverFileName('');
    setTags('AI, Programming');
    setPages('200');
    setFilePath('sample-vibe-coding.pdf');
    setEbookFileName('');
    setEbookFileSize('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  React.useEffect(() => {
    if (initialBookToEdit) {
      startEditing(initialBookToEdit);
    }
  }, [initialBookToEdit]);

  if (!isOpen) return null;

  // Double check admin role
  if (!isAdmin) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div className="tech-box" style={{ padding: '2rem', maxWidth: '420px', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--accent-red)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>จำกัดสิทธิ์เฉพาะ ADMIN</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            คุณต้องมีบทบาทเป็น Admin เท่านั้นจึงจะสามารถจัดการสินค้าได้
          </p>
          <button type="button" onClick={onClose} className="btn-cyber-red" style={{ width: '100%' }}>
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    );
  }

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFileName(file.name);
    setCoverUploading(true);
    setErrorMsg('');

    // Instant local preview via Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCoverUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setCoverUrl(data.url);
      }
    } catch (err) {
      console.warn('Upload API error, using Data URL fallback:', err);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleEbookFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEbookFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    setEbookFileSize(`${sizeMb} MB`);
    setFileUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFilePath(data.url);
      } else {
        setFilePath(file.name);
      }
    } catch (err) {
      console.warn('Upload API error, saving filename:', err);
      setFilePath(file.name);
    } finally {
      setFileUploading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!title.trim()) {
      setErrorMsg('กรุณากรอกชื่อหนังสือ');
      return;
    }
    if (!author.trim()) {
      setErrorMsg('กรุณากรอกชื่อผู้เขียน');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('กรุณากรอกคำอธิบายหนังสือ');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMsg('กรุณากรอกราคาที่ถูกต้อง (ตัวเลข >= 0)');
      return;
    }
    if (!coverUrl.trim()) {
      setErrorMsg('กรุณาระบุ URL รูปภาพหน้าปก');
      return;
    }

    setSubmitting(true);

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const bookPayload = {
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      price: numPrice,
      cover_url: coverUrl.trim(),
      file_path: filePath.trim() || 'sample-vibe-coding.pdf',
      tags: parsedTags.length > 0 ? parsedTags : ['E-BOOK'],
      pages: parseInt(pages, 10) || 150,
    };

    if (editingBookId) {
      const res = await updateBook(editingBookId, bookPayload);
      setSubmitting(false);

      if (res.success) {
        setSuccessMsg(`บันทึกการแก้ไขหนังสือ "${title}" เรียบร้อยแล้ว!`);
        cancelEditing();
      } else {
        setErrorMsg(res.error || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลหนังสือ');
      }
      return;
    }

    const res = await addBook(bookPayload);
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg(`เพิ่มหนังสือ "${title}" เข้าระบบเรียบร้อยแล้ว!`);
      // Reset form fields
      cancelEditing();
    } else {
      setErrorMsg(res.error || 'เกิดข้อผิดพลาดในการเพิ่มหนังสือ');
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteBook(id);
    setDeleteConfirmId(null);
    if (res.success) {
      setSuccessMsg('ลบหนังสือออกจากระบบเรียบร้อยแล้ว');
    } else {
      setErrorMsg(res.error || 'ไม่สามารถลบหนังสือได้');
    }
  };

  const handleReset = async () => {
    if (confirm('คุณต้องการรีเซ็ตรายการหนังสือกลับเป็น 3 เล่มตั้งต้นใช่หรือไม่?')) {
      await resetBooks();
      setSuccessMsg('รีเซ็ตรายการหนังสือกลับเป็นค่าเริ่มต้นเรียบร้อย');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 12, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <div
        className="tech-box"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1.5px solid var(--border-tech)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="red-pin"></span>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-cyber)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#0a0a0c',
                  letterSpacing: '0.5px',
                }}
              >
                ADMIN PRODUCT MANAGEMENT
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ผู้ดูแลระบบ: <strong style={{ color: 'var(--accent-red)' }}>{user?.username}</strong> | จัดการหนังสือและสินค้าหน้าร้าน
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f4f8',
              border: 'none',
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a0a0c',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-tech)',
            backgroundColor: '#f8fafc',
            padding: '0 1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'add' ? '2.5px solid var(--accent-red)' : '2.5px solid transparent',
              color: activeTab === 'add' ? 'var(--accent-red)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {editingBookId ? <Pencil size={16} /> : <Plus size={16} />}
            <span>{editingBookId ? 'แก้ไขข้อมูลหนังสือ (EDIT)' : 'เพิ่มสินค้าใหม่ (ADD BOOK)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('list')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'list' ? '2.5px solid var(--accent-red)' : '2.5px solid transparent',
              color: activeTab === 'list' ? 'var(--accent-red)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BookOpen size={16} />
            <span>รายการและจัดการสินค้า ({books.length})</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div
            style={{
              margin: '1rem 1.5rem 0 1.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255, 42, 42, 0.08)',
              border: '1px solid rgba(255, 42, 42, 0.3)',
              borderRadius: '6px',
              color: 'var(--accent-red)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              margin: '1rem 1.5rem 0 1.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              color: '#059669',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Body Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'add' ? (
            /* ========================================================
               TAB 1: ADD NEW BOOK FORM
               ======================================================== */
            <form onSubmit={handleAddBook}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {/* 1. Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    ชื่อหนังสือ (Book Title) <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น Fullstack Next.js Masterclass"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input-tech"
                    required
                  />
                </div>

                {/* 2. Author */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    ชื่อผู้เขียน (Author) <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น Dev Guru / Alex Rivera"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="form-input-tech"
                    required
                  />
                </div>

                {/* 3. Price */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    ราคาขาย (Price in THB) <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>
                      ฿
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="199.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="form-input-tech"
                      style={{ paddingLeft: '28px' }}
                      required
                    />
                  </div>
                </div>

                {/* 4. Pages */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    จำนวนหน้า (Pages)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="250"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="form-input-tech"
                  />
                </div>
              </div>

              {/* 5. Cover Image: Upload from Computer OR URL */}
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    รูปภาพหน้าปก (Cover Image) <span style={{ color: 'var(--accent-red)' }}>*</span>
                  </label>
                  {/* Toggle Pill */}
                  <div style={{ display: 'inline-flex', background: '#f1f4f8', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-tech)' }}>
                    <button
                      type="button"
                      onClick={() => setCoverMode('upload')}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '4px',
                        border: 'none',
                        background: coverMode === 'upload' ? '#0a0a0c' : 'transparent',
                        color: coverMode === 'upload' ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FolderOpen size={12} />
                      <span>เลือกจากเครื่อง</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverMode('url')}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '4px',
                        border: 'none',
                        background: coverMode === 'url' ? '#0a0a0c' : 'transparent',
                        color: coverMode === 'url' ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Link2 size={12} />
                      <span>ใส่ลิงก์ / Preset</span>
                    </button>
                  </div>
                </div>

                {coverMode === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={coverInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleCoverFileUpload}
                    />
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--border-tech)',
                        borderRadius: '8px',
                        padding: '1rem',
                        textAlign: 'center',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-red)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-tech)')}
                    >
                      <Upload size={22} color="var(--accent-red)" style={{ margin: '0 auto 6px auto' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0a0a0c' }}>
                        คลิกเพื่อเลือกไฟล์รูปภาพจากคอมพิวเตอร์
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        รองรับ PNG, JPG, JPEG, WEBP, SVG (แนะนำอัตราส่วนหนังสือแนวตั้ง)
                      </div>
                      {coverFileName && (
                        <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          <Check size={13} />
                          <span>เลือกไฟล์แล้ว: {coverFileName}</span>
                          {coverUploading && <span>(กำลังอัปโหลด...)</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="ใส่ URL รูปภาพ เช่น https://images.unsplash.com/..."
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      className="form-input-tech"
                      required
                    />
                    {/* Preset Pickers */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>รูปตัวอย่าง:</span>
                      {PRESET_COVERS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCoverUrl(preset.url)}
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: coverUrl === preset.url ? 'var(--accent-red)' : '#f1f4f8',
                            color: coverUrl === preset.url ? '#ffffff' : '#0a0a0c',
                            border: '1px solid var(--border-tech)',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Cover Preview */}
                {coverUrl && (
                  <div
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid var(--border-tech)',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '62px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.2)',
                        background: '#0a0a0c',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={coverUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/covers/book1.svg';
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <div><strong style={{ color: '#0a0a0c' }}>รูปภาพปกที่ใช้งาน:</strong> {coverFileName || (coverUrl.length > 40 ? coverUrl.substring(0, 40) + '...' : coverUrl)}</div>
                      <div style={{ fontSize: '0.7rem' }}>ภาพนี้จะแสดงในสไลด์โชว์ Hero และการ์ดสินค้าหน้าร้าน</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Tags */}
              <div style={{ marginTop: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  แท็กหมวดหมู่ (คั่นด้วยเครื่องหมายจุลภาค ,)
                </label>
                <input
                  type="text"
                  placeholder="เช่น AI, Next.js, Cloud, Fullstack"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="form-input-tech"
                />
              </div>

              {/* 7. Description */}
              <div style={{ marginTop: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  คำอธิบายหนังสือ (Description) <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="ระบุเนื้อหาและจุดเด่นของหนังสือเล่มนี้..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input-tech"
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              {/* 8. Download File: Upload from Computer OR URL */}
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    ไฟล์ E-book สำหรับดาวน์โหลด (E-book File)
                  </label>
                  {/* Toggle Pill */}
                  <div style={{ display: 'inline-flex', background: '#f1f4f8', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-tech)' }}>
                    <button
                      type="button"
                      onClick={() => setFileMode('upload')}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '4px',
                        border: 'none',
                        background: fileMode === 'upload' ? '#0a0a0c' : 'transparent',
                        color: fileMode === 'upload' ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FolderOpen size={12} />
                      <span>เลือกจากเครื่อง</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFileMode('url')}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '4px',
                        border: 'none',
                        background: fileMode === 'url' ? '#0a0a0c' : 'transparent',
                        color: fileMode === 'url' ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Link2 size={12} />
                      <span>ใส่ลิงก์ / Path</span>
                    </button>
                  </div>
                </div>

                {fileMode === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={ebookInputRef}
                      accept=".pdf,.epub,.zip,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={handleEbookFileUpload}
                    />
                    <div
                      onClick={() => ebookInputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--border-tech)',
                        borderRadius: '8px',
                        padding: '1rem',
                        textAlign: 'center',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-red)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-tech)')}
                    >
                      <FileText size={22} color="var(--accent-red)" style={{ margin: '0 auto 6px auto' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0a0a0c' }}>
                        คลิกเพื่อเลือกไฟล์ E-book จากคอมพิวเตอร์
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        รองรับ PDF, EPUB, ZIP, DOC, DOCX
                      </div>
                      {ebookFileName && (
                        <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          <Check size={13} />
                          <span>เลือกไฟล์แล้ว: {ebookFileName} ({ebookFileSize})</span>
                          {fileUploading && <span>(กำลังอัปโหลด...)</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="ใส่ URL ดาวน์โหลดภายนอก หรือชื่อไฟล์ เช่น sample-vibe-coding.pdf"
                      value={filePath}
                      onChange={(e) => setFilePath(e.target.value)}
                      className="form-input-tech"
                    />
                  </div>
                )}

                {filePath && (
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    ไฟล์ที่ผู้ซื้อจะได้รับหลังชำระเงิน: <strong style={{ color: '#0a0a0c' }}>{ebookFileName || filePath}</strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  marginTop: '1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  borderTop: '1px solid var(--border-tech)',
                  paddingTop: '1rem',
                }}
              >
                {editingBookId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="btn-cyber-outline"
                    style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}
                  >
                    ยกเลิกการแก้ไข
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-cyber-outline"
                >
                  ปิดหน้าต่าง
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-cyber-red"
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  {editingBookId ? <Pencil size={16} /> : <Plus size={16} />}
                  <span>
                    {submitting
                      ? 'กำลังบันทึก...'
                      : editingBookId
                      ? '💾 บันทึกการแก้ไข (SAVE CHANGES)'
                      : '➕ บันทึกและเพิ่มหนังสือ'}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================
               TAB 2: LIST & DELETE BOOKS
               ======================================================== */
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  มีหนังสือทั้งหมด <strong style={{ color: '#0a0a0c' }}>{books.length}</strong> เล่ม
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-cyber-outline"
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', gap: '4px' }}
                >
                  <RotateCcw size={14} />
                  <span>รีเซ็ตเป็นค่าเริ่มต้น (3 เล่ม)</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {books.map((book, idx) => (
                  <div
                    key={book.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid var(--border-tech)',
                      gap: '1rem',
                    }}
                  >
                    {/* Thumbnail & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: '42px',
                          height: '56px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          background: '#0a0a0c',
                          flexShrink: 0,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
                      >
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: '0.92rem',
                            color: '#0a0a0c',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {book.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ผู้เขียน: {book.author} • {book.pages || 100} หน้า
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        color: 'var(--accent-red)',
                        fontSize: '1rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ฿{Number(book.price).toFixed(2)}
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => startEditing(book)}
                        style={{
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Pencil size={13} />
                        <span>แก้ไข</span>
                      </button>

                      {deleteConfirmId === book.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 700 }}>
                            ยืนยันลบ?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDelete(book.id)}
                            style={{
                              background: 'var(--accent-red)',
                              color: '#fff',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            ลบ
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            style={{
                              background: '#e2e8f0',
                              color: '#0a0a0c',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(book.id)}
                          style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fecaca',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <Trash2 size={14} />
                          <span>ลบ</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
