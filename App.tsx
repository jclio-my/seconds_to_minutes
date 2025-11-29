import React from 'react';
import { TimeConverter } from './components/TimeConverter';
import { Clock, BarChart3 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Clock size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">时间数据转换器</h1>
          </div>
          <div className="flex items-center text-sm text-slate-500 gap-2">
            <BarChart3 size={16} />
            <span className="hidden sm:inline">秒转分钟计算工具</span>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <TimeConverter />
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} 时间转换工具</p>
      </footer>
    </div>
  );
}