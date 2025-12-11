import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowRight, 
  Trash2, 
  Copy, 
  RefreshCcw, 
  FileText, 
  Calculator,
  Clock
} from 'lucide-react';

interface DataPoint {
  id: number;
  original: string;
  seconds: number;
  minutes: number;
}

interface TimeSlotData {
  [key: string]: string; // 时间段ID -> 输入文本
}

interface TimeSlotStats {
  [key: string]: {
    dataPoints: DataPoint[];
    totalSeconds: number;
    totalMinutes: number;
  };
}

// 定义时间段
const TIME_SLOTS = [
  { id: '10-11', label: '10点到11点', description: '10点到11点' },
  { id: '11-12', label: '11点到12点', description: '11点到12点' },
  { id: '1.5-2.5', label: '1点半到2点半', description: '1点半到2点半' },
  { id: '2.5-3.5', label: '2点半到3点半', description: '2点半到3点半' },
  { id: '3.5-4.5', label: '3点半到4点半', description: '3点半到4点半' },
  { id: '4.5-5.5', label: '4点半到5点半', description: '4点半到5点半' },
  { id: '5.5-6.5', label: '5点半到6点半', description: '5点半到6点半' },
  { id: '6.5-7.5', label: '6点半到7点半', description: '6点半到7点半' },
];

const STORAGE_KEY = 'timeConverterData';

export const TimeConverter: React.FC = () => {
  const [activeTimeSlot, setActiveTimeSlot] = useState<string>('10-11');
  const [timeSlotData, setTimeSlotData] = useState<TimeSlotData>({});
  const [copiedTimeSlot, setCopiedTimeSlot] = useState<string | null>(null);
  const [totalTimeCopied, setTotalTimeCopied] = useState<boolean>(false);

  // 从localStorage加载数据
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setTimeSlotData(parsedData);
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timeSlotData));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }, [timeSlotData]);

  // 获取当前时间段的输入数据
  const currentInputText = timeSlotData[activeTimeSlot] || '';

  // 解析逻辑 - 为每个时间段计算数据
  const { timeSlotStats, overallStats } = useMemo(() => {
    const stats: TimeSlotStats = {};
    let overallTotalSeconds = 0;

    TIME_SLOTS.forEach(slot => {
      const inputText = timeSlotData[slot.id] || '';
      const lines = inputText.split('\n');
      const parsed: DataPoint[] = [];
      let totalSec = 0;

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // 尝试匹配分钟:秒格式 (例如: 1:56.57)
        const minuteMatch = trimmed.match(/^(\d+):([\d.]+)$/);
        // 尝试匹配纯秒数格式 (例如: 120.5s 或 120.5)
        const secondMatch = trimmed.match(/^([\d.]+)s?$/i);
        
        let seconds = 0;
        let isValid = false;
        
        if (minuteMatch && minuteMatch[1] && minuteMatch[2]) {
          // 分钟:秒格式处理
          const minutes = parseFloat(minuteMatch[1]);
          const secondsPart = parseFloat(minuteMatch[2]);
          if (!isNaN(minutes) && !isNaN(secondsPart)) {
            seconds = minutes * 60 + secondsPart;
            isValid = true;
          }
        } else if (secondMatch && secondMatch[1]) {
          // 纯秒数格式处理
          const secondsValue = parseFloat(secondMatch[1]);
          if (!isNaN(secondsValue)) {
            seconds = secondsValue;
            isValid = true;
          }
        }
        
        if (isValid) {
          const minutes = seconds / 60;
          parsed.push({
            id: index,
            original: trimmed,
            seconds,
            minutes
          });
          totalSec += seconds;
        }
      });

      stats[slot.id] = {
        dataPoints: parsed,
        totalSeconds: totalSec,
        totalMinutes: totalSec / 60
      };

      overallTotalSeconds += totalSec;
    });

    const overallStatsObj = {
      totalSeconds: overallTotalSeconds,
      totalMinutes: overallTotalSeconds / 60
    };

    return { timeSlotStats: stats, overallStats: overallStatsObj };
  }, [timeSlotData]);

  // 处理时间段切换
  const handleTimeSlotChange = (slotId: string) => {
    setActiveTimeSlot(slotId);
  };

  // 处理输入文本变化
  const handleInputChange = (value: string) => {
    setTimeSlotData(prev => ({
      ...prev,
      [activeTimeSlot]: value
    }));
  };

  // 清空当前时间段数据
  const handleClearCurrent = () => {
    setTimeSlotData(prev => ({
      ...prev,
      [activeTimeSlot]: ''
    }));
  };

  // 清空所有数据
  const handleClearAll = () => {
    setTimeSlotData({});
  };

  // 复制时间段总秒数
  const handleCopyTimeSlotTotal = (slotId: string) => {
    const stats = timeSlotStats[slotId];
    if (stats && stats.dataPoints.length > 0) {
      navigator.clipboard.writeText(`${stats.totalSeconds.toFixed(2)}`);
      setCopiedTimeSlot(slotId);
      setTimeout(() => setCopiedTimeSlot(null), 2000);
    }
  };

  // 复制总时长
  const handleCopyTotalTime = () => {
    const totalMinutes = overallStats.totalMinutes;
    let minutes = Math.floor(totalMinutes);
    let seconds = Math.round((totalMinutes % 1) * 60);
    
    if (seconds === 60) {
      minutes += 1;
      seconds = 0;
    }
    
    const totalTimeText = `标注${minutes}分钟${seconds}秒`;
    navigator.clipboard.writeText(totalTimeText);
    setTotalTimeCopied(true);
    setTimeout(() => setTotalTimeCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Input Section */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col h-full min-h-[500px]">
          
          {/* 时间段Tab栏 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                时间段选择
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => handleTimeSlotChange(slot.id)}
                  className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTimeSlot === slot.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={slot.description}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* 输入数据标题 */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              输入数据
              <span className="text-sm font-normal text-slate-500">
                ({TIME_SLOTS.find(s => s.id === activeTimeSlot)?.description})
              </span>
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={handleClearCurrent}
                className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1"
                title="清空当前时间段数据"
              >
                <Trash2 size={14} /> 清空
              </button>
              <button 
                onClick={handleClearAll}
                className="text-xs px-2 py-1 text-orange-600 hover:bg-orange-50 rounded transition-colors flex items-center gap-1"
                title="清空所有时间段数据"
              >
                <Trash2 size={14} /> 全部清空
              </button>
            </div>
          </div>
          
          <textarea
            className="flex-grow w-full p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-slate-700 leading-relaxed"
            placeholder="请在此粘贴数据...&#10;示例：&#10;120s&#10;60s&#10;300.5s&#10;1:56.57 (分钟:秒格式)"
            value={currentInputText}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          
          <div className="mt-3 text-xs text-slate-500 text-right">
            检测到 {currentInputText.split('\n').filter(l => l.trim()).length} 行数据
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
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="数据行数" value={timeSlotStats[activeTimeSlot]?.dataPoints.length || 0} />
          <div className="relative">
            {(() => {
              const totalMinutes = overallStats.totalMinutes;
              let minutes = Math.floor(totalMinutes);
              let seconds = Math.round((totalMinutes % 1) * 60);
              
              if (seconds === 60) {
                minutes += 1;
                seconds = 0;
              }
              
              return <StatCard label="分钟/秒" value={`标注${minutes}分钟${seconds}秒`} />;
            })()}
            <button
              onClick={handleCopyTotalTime}
              disabled={overallStats.totalSeconds === 0}
              className={`absolute top-2 right-2 p-1.5 rounded text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed
                ${totalTimeCopied
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              title="复制总时长"
            >
              {totalTimeCopied ? '✓' : <Copy size={12} />}
            </button>
          </div>
        </div>
        
        {/* Time Total Duration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <StatCard
            label="时间总时长"
            value={(() => {
              const totalMinutes = overallStats.totalMinutes;
              return totalMinutes.toLocaleString('zh-CN', {
                minimumFractionDigits: 5,
                maximumFractionDigits: 5
              });
            })()}
          />
        </div>

        {/* Time Slots Results */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-grow min-h-[400px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              时间段统计
            </h2>
          </div>

          <div className="overflow-y-auto flex-grow h-0 p-2">
            {TIME_SLOTS.every(slot => timeSlotStats[slot.id]?.dataPoints.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Calculator size={32} className="opacity-50" />
                </div>
                <p className="text-center">未找到有效数据。<br/>请选择时间段并输入以 's' 结尾的数值、纯数字或分钟:秒格式(如1:56.57)。</p>
              </div>
            ) : (
              <div className="space-y-3">
                {TIME_SLOTS.map(slot => {
                  const stats = timeSlotStats[slot.id];
                  const hasData = stats && stats.dataPoints.length > 0;
                  
                  return (
                    <div 
                      key={slot.id} 
                      className={`border rounded-lg p-3 transition-all ${
                        activeTimeSlot === slot.id 
                          ? 'border-indigo-300 bg-indigo-50/30' 
                          : 'border-slate-200 bg-white'
                      } ${hasData ? 'shadow-sm' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{slot.label}</span>
                          <span className="text-xs text-slate-500">({slot.description})</span>
                          {hasData && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                              {stats.dataPoints.length} 条数据
                            </span>
                          )}
                        </div>
                        {hasData && (
                          <button
                            onClick={() => handleCopyTimeSlotTotal(slot.id)}
                            className={`text-xs px-2 py-1 rounded transition-all flex items-center gap-1
                              ${copiedTimeSlot === slot.id
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            title="复制时间段总秒数"
                          >
                            {copiedTimeSlot === slot.id ? (
                              <>✓ 已复制</>
                            ) : (
                              <><Copy size={12} /> 复制秒数</>
                            )}
                          </button>
                        )}
                      </div>
                      
                      {hasData ? (
                        <div className="text-sm">
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <span className="text-slate-500">总秒数: </span>
                              <span className="font-mono font-medium text-slate-800">
                                {stats.totalSeconds.toFixed(2)}s
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500">总分钟: </span>
                              <span className="font-mono font-medium text-emerald-600">
                                {stats.totalMinutes.toFixed(4)}min
                              </span>
                            </div>
                          </div>
                          
                          <details className="text-xs text-slate-600">
                            <summary className="cursor-pointer hover:text-slate-800">查看详细数据</summary>
                            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                              {stats.dataPoints.map(point => (
                                <div key={point.id} className="flex justify-between py-1 border-b border-slate-100">
                                  <span className="font-mono">{point.original}</span>
                                  <span className="font-mono">{point.minutes.toFixed(4)}min</span>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400 italic">
                          暂无数据
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 rounded-b-xl flex justify-between items-center">
            <span>计算公式: 秒 / 60</span>
            <span>共 {TIME_SLOTS.filter(slot => timeSlotStats[slot.id]?.dataPoints.length > 0).length} 个时间段有数据</span>
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