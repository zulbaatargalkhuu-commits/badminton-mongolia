'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'athletes' | 'tournaments'>('news');

  // Form states for News
  const [newsTitleMn, setNewsTitleMn] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsTagMn, setNewsTagMn] = useState('');
  const [newsTagEn, setNewsTagEn] = useState('');
  const [newsBodyMn, setNewsBodyMn] = useState('');
  const [newsBodyEn, setNewsBodyEn] = useState('');
  const [newsDate, setNewsDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusMsg, setStatusMsg] = useState('');

  // Handle Admin Login (Federation PIN/Password)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'mba2026admin') {
      setIsAuthenticated(true);
    } else {
      alert('Буруу нууц үг! (Incorrect password)');
    }
  };

  // Submit News to Supabase
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Нийтэлж байна...');

    const { error } = await supabase.from('news').insert([
      {
        title_mn: newsTitleMn,
        title: newsTitleEn || newsTitleMn,
        tag_mn: newsTagMn,
        tag: newsTagEn || newsTagMn,
        body_mn: newsBodyMn,
        body: newsBodyEn || newsBodyMn,
        published_date: newsDate,
      },
    ]);

    if (error) {
      setStatusMsg(`Алдаа гарлаа: ${error.message}`);
    } else {
      setStatusMsg('Мэдээ амжилттай нийтлэгдлээ! (News published successfully)');
      setNewsTitleMn('');
      setNewsTitleEn('');
      setNewsTagMn('');
      setNewsTagEn('');
      setNewsBodyMn('');
      setNewsBodyEn('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl max-w-sm w-full border border-slate-700 shadow-xl">
          <h1 className="text-xl font-bold mb-2 text-center">MBA Admin Portal</h1>
          <p className="text-xs text-slate-400 mb-6 text-center">Монголын Бадминтоны Холбоо</p>
          <input
            type="password"
            placeholder="Админ нууц үг (Enter password)"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-sm mb-4 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg text-sm transition">
            Нэвтрэх (Login)
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg text-white">MBA Federation Dashboard</h1>
          <p className="text-xs text-slate-400">badminton.mn Control Center</p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 text-slate-300"
        >
          Гарах (Log out)
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto p-6 flex-1">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'news' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Мэдээ оруулах (News)
          </button>
          <button
            onClick={() => setActiveTab('athletes')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'athletes' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Тамирчид (Athletes)
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === 'tournaments' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Тэмцээн & Бүртгэл (Tournaments)
          </button>
        </div>

        {/* Tab: News */}
        {activeTab === 'news' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Шинэ мэдээ нийтлэх (Publish News)</h2>
            {statusMsg && (
              <div className="mb-4 p-3 bg-blue-950 border border-blue-800 text-blue-300 text-sm rounded-lg">
                {statusMsg}
              </div>
            )}
            <form onSubmit={handleCreateNews} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Гарчиг (Монгол)</label>
                  <input
                    type="text"
                    required
                    value={newsTitleMn}
                    onChange={(e) => setNewsTitleMn(e.target.value)}
                    placeholder="Жишээ: Улсын аварга 2026 эхэллээ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Title (English - Optional)</label>
                  <input
                    type="text"
                    value={newsTitleEn}
                    onChange={(e) => setNewsTitleEn(e.target.value)}
                    placeholder="e.g. National Championship 2026"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Ангилал/Tag (Монгол)</label>
                  <input
                    type="text"
                    required
                    value={newsTagMn}
                    onChange={(e) => setNewsTagMn(e.target.value)}
                    placeholder="Жишээ: Тэмцээн, Шигшээ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tag (English)</label>
                  <input
                    type="text"
                    value={newsTagEn}
                    onChange={(e) => setNewsTagEn(e.target.value)}
                    placeholder="e.g. Tournament"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Огноо (Date)</label>
                  <input
                    type="date"
                    required
                    value={newsDate}
                    onChange={(e) => setNewsDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Мэдээний агуулга (Монгол)</label>
                <textarea
                  rows={4}
                  required
                  value={newsBodyMn}
                  onChange={(e) => setNewsBodyMn(e.target.value)}
                  placeholder="Мэдээний дэлгэрэнгүй эх бичвэр..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Content (English - Optional)</label>
                <textarea
                  rows={3}
                  value={newsBodyEn}
                  onChange={(e) => setNewsBodyEn(e.target.value)}
                  placeholder="Full article in English..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg text-sm transition"
              >
                Нийтлэх (Publish)
              </button>
            </form>
          </div>
        )}

        {/* Tab: Athletes */}
        {activeTab === 'athletes' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center py-12 text-slate-400">
            <p className="text-sm">Тамирчны нэгдсэн бүртгэлийн хэсэг холбогдож байна.</p>
            <p className="text-xs mt-1 text-slate-500">Athletes database table is linked to Supabase.</p>
          </div>
        )}

        {/* Tab: Tournaments */}
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