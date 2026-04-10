"use client";

import React from 'react';

interface SalesGoalProps {
  current: number;
  goal: number;
}

export function SalesGoal({ current, goal }: SalesGoalProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  return (
    <div className="card bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Meta de Venta Mes</h4>
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-lg font-black text-slate-800">
            ${current.toLocaleString()} 
            <span className="text-[10px] text-slate-400 font-bold ml-1">/ ${goal.toLocaleString()}</span>
          </span>
          <span className="text-xs font-black text-primary">{percentage}%</span>
        </div>
        <progress 
          className="progress progress-primary w-full h-3" 
          value={percentage} 
          max="100"
        ></progress>
      </div>
    </div>
  );
}
