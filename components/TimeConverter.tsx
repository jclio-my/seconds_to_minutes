import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Trash2, 
  Copy, 
  RefreshCcw, 
  FileText, 
  Calculator,
  Download
} from 'lucide-react';

interface DataPoint {
  id: number;
  original: string;
  seconds: number;
  minutes: number;
}

interface Stats {
  count: number;
  totalSeconds: number;
  totalMinutes: number;
  avgSeconds: number;
  avgMinutes: number;
  maxMinutes: number;
  minMinutes: number;
}

const SAMPLE_DATA = `176.38s
65.37s
56.43s
92.53s
104.3s
113.33s
94.27s
89.33s
72.1s
137.53s
97.63s
74.4s
51.83s
79.37s
28.57s
63.6s
55.07s
136.8s`;

export const TimeConverter: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_DATA);
  const [copied, setCopied] = useState<boolean>(false);

  // Parse logic
  const { dataPoints, stats } = useMemo(() => {
    const lines = inputText.split('\n');
    const parsed: DataPoint[] = [];
    
    let totalSec = 0;
    let maxMin = -Infinity;
    let minMin = Infinity;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Match number potentially followed by 's' (case insensitive)
      // Regex explanation:
      // ^ start of string
      // ([\d.]+) capture group for digits and dots
      // s? optional 's' character
      // $ end of string
      const match = trimmed.match(/^([\d.]+)s?$/i);
      
      if (match && match[1]) {
        const seconds = parseFloat(match[1]);
        if (!isNaN(seconds)) {
          const minutes = seconds / 60;
          parsed.push({
            id: index,
            original: trimmed,
            seconds,
            minutes
          });

          totalSec += seconds;
          if (minutes > maxMin) maxMin = minutes;
          if (minutes < minMin) minMin = minutes;
        }
      }
    });

    const count = parsed.length;
    const statsObj: Stats = {
      count,
      totalSeconds: totalSec,
      totalMinutes: totalSec / 60,
      avgSeconds: count > 0 ? totalSec / count : 0,
      avgMinutes: count > 0 ? (totalSec / 60) / count : 0,
      maxMinutes: maxMin === -Infinity ? 0 : maxMin,
      minMinutes: minMin === Infinity ? 0 : minMin,
    };

    return { dataPoints: parsed, stats: statsObj };
  }, [inputText]);

  // Handlers
  const handleCopyResults = () => {
    const resultText = dataPoints.map(p => `${p.minutes.toFixed(4)} min`).join('\n');
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const header = "原始数据,秒,分钟\n";
    const rows = dataPoints.map(p => `${p.original},${p.seconds},${p.minutes.toFixed(4)}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'time_data_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Input Section */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              输入数据
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setInputText('')}
                className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1"
                title="清空所有文本"
              >
                <Trash2 size={14} /> 清空
              </button>
              <button 
                onClick={() => setInputText(SAMPLE_DATA)}
                className="text-xs px-2 py-1 text-slate-600 hover:bg-slate-100 rounded transition-colors flex items-center gap-1"
                title="重置为示例文本"
              >
                <RefreshCcw size={14} /> 示例
              </button>
            </div>
          </div>
          
          <textarea
            className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-slate-700 leading-relaxed"
            placeholder="请在此粘贴数据...&#10;示例：&#10;120s&#10;60s&#10;300.5s"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="mt-3 text-xs text-slate-500 text-right">
            检测到 {inputText.split('\n').filter(l => l.trim()).length} 行数据
          </div>
        </div>
      </div>

      {/* Middle Arrow (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
        <div className="bg-slate-100 p-3 rounded-full text-slate-400">
          <ArrowRight size={24} />
        </div>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        
        {/* Statistics Card */}
        <div className="grid grid-cols-2 gap-3">
            <StatCard label="数据行数" value={stats.count} />
            <StatCard label="总时长 (分钟)" value={stats.totalMinutes.toFixed(2)} />
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-grow min-h-[400px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              计算结果
            </h2>
            <div className="flex gap-2">
               <button 
                onClick={handleDownloadCSV}
                disabled={dataPoints.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button 
                onClick={handleCopyResults}
                disabled={dataPoints.length === 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  ${copied 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 shadow-sm'
                  }`}
              >
                {copied ? <span className="flex items-center gap-1">已复制!</span> : <span className="flex items-center gap-1"><Copy size={14} /> 复制分钟数</span>}
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-grow h-0 p-2">
             {dataPoints.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                   <Calculator size={32} className="opacity-50" />
                 </div>
                 <p className="text-center">未找到有效数据。<br/>请输入以 's' 结尾的数值或纯数字。</p>
               </div>
             ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 rounded-l-lg">原始数据</th>
                    <th className="px-4 py-2">秒 (s)</th>
                    <th className="px-4 py-2 rounded-r-lg text-right font-bold text-slate-700">分钟 (min)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataPoints.map((point) => (
                    <tr key={point.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-slate-500">{point.original}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-600">{point.seconds.toFixed(2)}</td>
                      <td className="px-4 py-2.5 font-mono font-medium text-emerald-600 text-right">
                        {point.minutes.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             )}
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 rounded-b-xl flex justify-between items-center">
             <span>计算公式: 秒 / 60</span>
             <span>显示 {dataPoints.length} 行</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Stats
const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center">
    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{label}</span>
    <span className="text-lg font-mono font-semibold text-indigo-600">{value}</span>
  </div>
);