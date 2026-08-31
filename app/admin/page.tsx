"use client";

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [activeTab, setActiveTab] = useState('news');

  // News Form States
  const [newsTitleMn, setNewsTitleMn] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsTagMn, setNewsTagMn] = useState('');
  const [newsTagEn, setNewsTagEn] = useState('');
  const [newsDate, setNewsDate] = useState(new Date().toISOString().split('T')[0]);
  const [newsBodyMn, setNewsBodyMn] = useState('');
  const [newsBodyEn, setNewsBodyEn] = useState('');

  // Image Upload States
  const [newsImage, setNewsImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Status States
  const [statusMsg, setStatusMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 1. Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'mba2026admin') {
      setIsAuthenticated(true);
    } else {
      alert('Нууц үг буруу байна! (Incorrect password)');
    }
  };

  // 2. Image Selection Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Зөвхөн зураг оруулна уу! (Please select an image file.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Зургийн хэмжээ 10MB-аас бага байх ёстой! (Image must be < 10MB)');
      return;
    }

    setNewsImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // 3. Submit Handler
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUploading(true);
      setStatusMsg('Мэдээ нийтлэхээр бэлтгэж байна... (Preparing...)');
      let imageUrl = null;

      // Upload image if one was selected
      if (newsImage) {
        setStatusMsg('Зураг хуулж байна... (Uploading image to Supabase...)');
        const fileExt = newsImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('news-images')
          .upload(filePath, newsImage, {
            cacheControl: '3600',
            upsert: false,
            contentType: newsImage.type,
          });

        if (uploadError) throw new Error(`Зураг upload хийхэд алдаа: ${uploadError.message}`);

        // Get the public URL for the database
        const { data: publicUrlData } = supabase.storage
          .from('news-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      setStatusMsg('Мэдээг баазад хадгалж байна... (Saving news...)');

      // Insert into the database
      const { error } = await supabase.from('news').insert([{
        title_mn: newsTitleMn,
        title: newsTitleEn || null,
        tag_mn: newsTagMn,
        tag: newsTagEn || null,
        body_mn: newsBodyMn,
        body: newsBodyEn || null,
        published_date: newsDate,
        image_url: imageUrl,
      }]);

      if (error) throw new Error(`Мэдээ хадгалахад алдаа: ${error.message}`);

      setStatusMsg('Мэдээ болон зураг амжилттай нийтлэгдлээ! (Published successfully!)');

      // Reset form
      setNewsTitleMn('');
      setNewsTitleEn('');
      setNewsTagMn('');
      setNewsTagEn('');
      setNewsBodyMn('');
      setNewsBodyEn('');
      setNewsImage(null);
      setImagePreview(null);

    } catch (error: any) {
      console.error('Publish error:', error);
      setStatusMsg(error?.message || 'Мэдээ нийтлэх үед алдаа гарлаа. (Error publishing.)');
    } finally {
      setIsUploading(false);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-sm">
          <h2 className="text-xl font-bold mb-6 text-center">MBA Admin Portal</h2>
          <input
            type="password"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            placeholder="Админ нууц үг (Password)"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg mb-4 text-sm"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition">
            Нэвтрэх (Login)
          </button>
        </form>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 p-4 md:p-8">
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">MBA Federation Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">badminton.mn Control Center</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm transition">
          Гарах (Log out)
        </button>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-2 mb-6 border-b border-slate-800">
          <button onClick={() => setActiveTab('news')} className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'news' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Мэдээ оруулах (News)</button>
          <button onClick={() => setActiveTab('athletes')} className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'athletes' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Тамирчид (Athletes)</button>
          <button onClick={() => setActiveTab('tournaments')} className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'tournaments' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>Тэмцээн & Бүртгэл (Tournaments)</button>
        </div>

        {activeTab === 'news' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Шинэ мэдээ нийтлэх (Publish News)</h2>
            {statusMsg && (
              <div className={`mb-4 p-3 border text-sm rounded-lg ${statusMsg.includes('алдаа') || statusMsg.includes('Error') ? 'bg-red-950/50 border-red-800 text-red-300' : 'bg-blue-950/50 border-blue-800 text-blue-300'}`}>
                {statusMsg}
              </div>
            )}
            
            <form onSubmit={handleCreateNews} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Гарчиг (Монгол)</label>
                  <input type="text" required value={newsTitleMn} onChange={(e) => setNewsTitleMn(e.target.value)} placeholder="Жишээ: Улсын аварга 2026 эхэллээ" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Title (English - Optional)</label>
                  <input type="text" value={newsTitleEn} onChange={(e) => setNewsTitleEn(e.target.value)} placeholder="e.g. National Championship 2026" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Ангилал/Tag (Монгол)</label>
                  <input type="text" required value={newsTagMn} onChange={(e) => setNewsTagMn(e.target.value)} placeholder="Жишээ: Тэмцээн, Шигшээ" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tag (English)</label>
                  <input type="text" value={newsTagEn} onChange={(e) => setNewsTagEn(e.target.value)} placeholder="e.g. Tournament" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Огноо (Date)</label>
                  <input type="date" required value={newsDate} onChange={(e) => setNewsDate(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm" />
                </div>
              </div>

              {/* NEW IMAGE UPLOAD SECTION */}
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950">
                <label className="block text-xs font-semibold text-slate-400 mb-2">Нүүр зураг (News Image)</label>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-500 cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">Зургийн урьдчилсан харагдац (Preview)</p>
                    <img src={imagePreview} alt="News preview" className="w-full max-h-64 object-cover rounded-lg border border-slate-800" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Мэдээний агуулга (Монгол)</label>
                <textarea rows={4} required value={newsBodyMn} onChange={(e) => setNewsBodyMn(e.target.value)} placeholder="Мэдээний дэлгэрэнгүй эх бичвэр..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Content (English - Optional)</label>
                <textarea rows={3} value={newsBodyEn} onChange={(e) => setNewsBodyEn(e.target.value)} placeholder="Full article in English..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm" />
              </div>

              <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed font-semibold rounded-lg text-sm transition">
                {isUploading ? 'Нийтэлж байна (Publishing)...' : 'Нийтлэх (Publish)'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'athletes' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center py-12 text-slate-400">
            <p className="text-sm">Тамирчны нэгдсэн бүртгэлийн хэсэг холбогдож байна.</p>
            <p className="text-xs mt-1 text-slate-500">Athletes database table is linked to Supabase.</p>
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center py-12 text-slate-400">
            <p className="text-sm">Тэмцээний систем ба клубийн бүртгэлийн удирдлага.</p>
            <p className="text-xs mt-1 text-slate-500">Tournament brackets and club management connected.</p>
          </div>
        )}
      </div>
    </div>
  );
}